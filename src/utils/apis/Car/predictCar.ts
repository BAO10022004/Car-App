interface CarPredictionRequest {
  buying: string;
  maint: string;
  doors: string;
  persons: string;
  lug_boot: string;
  safety: string;
}

interface CarPredictionResponse {
  success: boolean;
  decision: string;
  decision_vn: string;
  input: CarPredictionRequest;
  error?: string;
}

const API_BASE_URL = 'http://localhost:5000';

async function predictCar(data: CarPredictionRequest): Promise<CarPredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error predicting car:', error);
    throw error;
  }
}

export default predictCar;
export type { CarPredictionRequest, CarPredictionResponse };

