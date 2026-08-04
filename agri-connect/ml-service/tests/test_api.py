import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "agriconnect-ml"}

def test_version():
    response = client.get("/version")
    assert response.status_code == 200
    assert response.json() == {"version": "1.0.0"}

def test_predict_crop_valid():
    # The models must be loaded for this test to pass
    with TestClient(app) as client:
        payload = {
            "nitrogen": 90,
            "phosphorus": 42,
            "potassium": 43,
            "temperature": 20.8,
            "humidity": 82.0,
            "ph": 6.5,
            "rainfall": 202.9
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "crop" in data
        assert "confidence_score" in data
        assert "short_description" in data

def test_predict_crop_invalid_payload():
    with TestClient(app) as client:
        # missing nitrogen
        payload = {
            "phosphorus": 42,
            "potassium": 43,
            "temperature": 20.8,
            "humidity": 82.0,
            "ph": 6.5,
            "rainfall": 202.9
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422 # Pydantic validation error

