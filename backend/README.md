# Backend API - Car Evaluation Predictor

## Cài đặt

1. Virtual environment đã có sẵn trong thư mục `../venv`

2. Kích hoạt virtual environment:
- Windows: `..\venv\Scripts\activate`
- Linux/Mac: `source ../venv/bin/activate`

3. Cài đặt dependencies (đảm bảo đã activate venv):
```bash
pip install -r requirements.txt
```

**Lưu ý quan trọng:** Model được train với numpy 2.x, cần đảm bảo:
- numpy >= 2.0.0
- scikit-learn >= 1.4.0 (hỗ trợ numpy 2.x)
- pandas >= 2.2.0 (tương thích numpy 2.x)

## Chạy server

**Cách 1: Sử dụng script (Windows)**
```bash
run.bat
```

**Cách 2: Chạy thủ công**
```bash
# Activate venv trước
..\venv\Scripts\activate  # Windows
# hoặc
source ../venv/bin/activate  # Linux/Mac

# Sau đó chạy
python app.py
```

Server sẽ chạy tại `http://localhost:5000`

## API Endpoints

### POST /api/predict
Dự đoán mức độ chấp nhận của xe

**Request Body:**
```json
{
  "buying": "vhigh|high|med|low",
  "maint": "vhigh|high|med|low",
  "doors": "2|3|4|5more",
  "persons": "2|4|more",
  "lug_boot": "small|med|big",
  "safety": "low|med|high"
}
```

**Response:**
```json
{
  "success": true,
  "decision": "unacc|acc|good|vgood",
  "decision_vn": "Không chấp nhận|Chấp nhận|Tốt|Rất tốt",
  "input": { ... }
}
```

### GET /api/health
Kiểm tra trạng thái server và model

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "scaler_loaded": true,
  "encoder_loaded": true
}
```

