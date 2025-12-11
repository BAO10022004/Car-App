from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import OrdinalEncoder
import warnings

# Suppress sklearn version warnings khi load model
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

app = Flask(__name__)
CORS(app)

# Đường dẫn đến model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'svm_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'scaler.pkl')

# Load model và scaler
model = None
scaler = None
encoder = None

def load_models():
    global model, scaler, encoder
    try:
        # Kiểm tra file tồn tại
        if not os.path.exists(MODEL_PATH):
            print(f"Lỗi: Không tìm thấy file model tại {MODEL_PATH}")
            return
        if not os.path.exists(SCALER_PATH):
            print(f"Lỗi: Không tìm thấy file scaler tại {SCALER_PATH}")
            return
        
        # Load với joblib (model được lưu bằng joblib)
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        # Tạo OrdinalEncoder với đúng categories như khi train
        encoder = OrdinalEncoder(
            categories=[
                ['low', 'med', 'high', 'vhigh'],   # buying
                ['low', 'med', 'high', 'vhigh'],   # maint
                ['2', '3', '4', '5more'],          # doors
                ['2', '4', 'more'],                # persons
                ['small', 'med', 'big'],           # lug_boot
                ['low', 'med', 'high']             # safety
            ],
            handle_unknown='use_encoded_value',
            unknown_value=-1
        )
        
        # Fit encoder với một sample để khởi tạo (không cần fit thực sự vì đã có categories)
        sample = pd.DataFrame([['low', 'low', '2', '2', 'small', 'low']], 
                            columns=['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety'])
        encoder.fit(sample)
        
        print("Model, scaler và encoder đã được load thành công!")
        
    except Exception as e:
        print(f"Lỗi khi load model: {e}")
        import traceback
        traceback.print_exc()
        model = None
        scaler = None
        encoder = None

# Load model khi khởi động
load_models()

# Mapping kết quả
DECISION_MAPPING = {
    0: 'unacc',
    1: 'acc', 
    2: 'good',
    3: 'vgood'
}

def preprocess_input(buying, maint, doors, persons, lug_boot, safety):
    """Chuyển đổi input thành DataFrame và encode bằng OrdinalEncoder"""
    # Tạo DataFrame với đúng thứ tự columns
    input_df = pd.DataFrame([[
        buying.lower(),
        maint.lower(),
        str(doors).lower(),
        str(persons).lower(),
        lug_boot.lower(),
        safety.lower()
    ]], columns=['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety'])
    
    # Encode bằng OrdinalEncoder
    encoded = encoder.transform(input_df)
    
    return encoded

def predict_decision(sample_dict):
    encoded = preprocess_input(
        sample_dict['buying'],
        sample_dict['maint'],
        sample_dict['doors'],
        sample_dict['persons'],
        sample_dict['lug_boot'],
        sample_dict['safety']
    )
    scaled = scaler.transform(encoded)
    pred = model.predict(scaled)[0]
    return DECISION_MAPPING.get(int(pred), 'unacc')

def bfs_optimize(input_sample, target='vgood', max_depth=2):
    """
    Tìm thay đổi tối thiểu để đạt target decision.
    Ưu tiên feature theo trọng số (mô phỏng SHAP/importance).
    """
    # Thứ tự ưu tiên (có thể điều chỉnh sau nếu có SHAP thực sự)
    feature_priority = ['safety', 'persons', 'lug_boot', 'maint', 'buying', 'doors']
    value_orders = {
        'safety': ['low', 'med', 'high'],
        'persons': ['2', '4', 'more'],
        'lug_boot': ['small', 'med', 'big'],
        'maint': ['low', 'med', 'high', 'vhigh'],
        'buying': ['low', 'med', 'high', 'vhigh'],
        'doors': ['2', '3', '4', '5more']
    }

    def neighbors(sample):
        for feat in feature_priority:
            current = str(sample[feat]).lower()
            options = value_orders[feat]
            if current not in options:
                continue
            for new_val in options:
                if new_val == current:
                    continue
                new_sample = dict(sample)
                new_sample[feat] = new_val
                yield feat, new_val, new_sample

    start_decision = predict_decision(input_sample)
    if start_decision == target:
        return {
            'decision': start_decision,
            'changes': [],
            'steps': 0
        }

    visited = set()
    from collections import deque
    q = deque()
    q.append((input_sample, [], 0))
    visited.add(tuple(input_sample.items()))

    best = {'decision': start_decision, 'changes': [], 'steps': 0}

    while q:
        sample, changes, depth = q.popleft()
        if depth >= max_depth:
            continue
        for feat, new_val, next_sample in neighbors(sample):
            key = tuple(next_sample.items())
            if key in visited:
                continue
            visited.add(key)
            decision = predict_decision(next_sample)
            new_changes = changes + [{'feature': feat, 'value': new_val}]
            if decision == target:
                return {
                    'decision': decision,
                    'changes': new_changes,
                    'steps': depth + 1
                }
            # cập nhật best nếu tốt hơn (ưu tiên decision thứ bậc)
            best_rank = ['unacc', 'acc', 'good', 'vgood']
            if best_rank.index(decision) > best_rank.index(best['decision']):
                best = {'decision': decision, 'changes': new_changes, 'steps': depth + 1}
            q.append((next_sample, new_changes, depth + 1))

    return best

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None or encoder is None:
            return jsonify({'error': 'Model, scaler hoặc encoder chưa được load'}), 500
        
        data = request.json
        
        # Validate input
        required_fields = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Thiếu trường: {field}'}), 400
        
        # Get values
        buying = data['buying']
        maint = data['maint']
        doors = data['doors']
        persons = data['persons']
        lug_boot = data['lug_boot']
        safety = data['safety']
        
        # Preprocess
        input_data = preprocess_input(buying, maint, doors, persons, lug_boot, safety)
        
        # Scale data
        scaled_data = scaler.transform(input_data)
        
        # Predict
        prediction = model.predict(scaled_data)[0]
        decision = DECISION_MAPPING.get(int(prediction), 'unacc')
        
        # Map decision to Vietnamese
        decision_vn = {
            'unacc': 'Không chấp nhận',
            'acc': 'Chấp nhận',
            'good': 'Tốt',
            'vgood': 'Rất tốt'
        }
        
        return jsonify({
            'success': True,
            'decision': decision,
            'decision_vn': decision_vn.get(decision, decision),
            'input': {
                'buying': buying,
                'maint': maint,
                'doors': doors,
                'persons': persons,
                'lug_boot': lug_boot,
                'safety': safety
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        if model is None or scaler is None or encoder is None:
            return jsonify({'error': 'Model, scaler hoặc encoder chưa được load'}), 500

        data = request.json or {}
        required_fields = ['buying', 'maint', 'doors', 'persons', 'lug_boot', 'safety']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Thiếu trường: {field}'}), 400

        target = data.get('target', 'vgood')
        input_sample = {
            'buying': str(data['buying']).lower(),
            'maint': str(data['maint']).lower(),
            'doors': str(data['doors']).lower(),
            'persons': str(data['persons']).lower(),
            'lug_boot': str(data['lug_boot']).lower(),
            'safety': str(data['safety']).lower()
        }

        current_decision = predict_decision(input_sample)
        result = bfs_optimize(input_sample, target=target, max_depth=2)

        decision_vn = {
            'unacc': 'Không chấp nhận',
            'acc': 'Chấp nhận',
            'good': 'Tốt',
            'vgood': 'Rất tốt'
        }

        return jsonify({
            'success': True,
            'current_decision': current_decision,
            'current_decision_vn': decision_vn.get(current_decision, current_decision),
            'target': target,
            'target_vn': decision_vn.get(target, target),
            'result': {
                'decision': result['decision'],
                'decision_vn': decision_vn.get(result['decision'], result['decision']),
                'changes': result['changes'],
                'steps': result['steps']
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None,
        'encoder_loaded': encoder is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')

