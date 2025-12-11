import type { CarPredictionRequest } from './predictCar';

export interface OptimizeRequest extends CarPredictionRequest {
  target?: 'unacc' | 'acc' | 'good' | 'vgood';
}

export interface OptimizeResponse {
  success: boolean;
  current_decision: string;
  current_decision_vn: string;
  target: string;
  target_vn: string;
  result: {
    decision: string;
    decision_vn: string;
    changes: { feature: string; value: string }[];
    steps: number;
  };
  error?: string;
}

const API_BASE_URL = 'http://localhost:5000';

async function optimizeCar(data: OptimizeRequest): Promise<OptimizeResponse> {
  const resp = await fetch(`${API_BASE_URL}/api/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
  return resp.json();
}

export default optimizeCar;

