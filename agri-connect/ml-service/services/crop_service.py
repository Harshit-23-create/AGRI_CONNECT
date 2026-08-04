import joblib
import os
import numpy as np
from models.schemas import SoilData
from utils.logger import logger

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

# We will load these once during the service startup
_model = None
_label_encoder = None

def load_models():
    global _model, _label_encoder
    if _model is None or _label_encoder is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
            raise FileNotFoundError(
                "Model files not found. Ensure 'train_model.py' has been executed."
            )
        logger.info("Loading RandomForest model and LabelEncoder from disk...")
        _model = joblib.load(MODEL_PATH)
        _label_encoder = joblib.load(ENCODER_PATH)
        logger.info("Models loaded successfully.")

def predict_crop(data: SoilData):
    if _model is None or _label_encoder is None:
        load_models()
        
    features = np.array([[
        data.nitrogen, 
        data.phosphorus, 
        data.potassium, 
        data.temperature, 
        data.humidity, 
        data.ph, 
        data.rainfall
    ]])

    # Get class probabilities
    probabilities = _model.predict_proba(features)[0]
    
    # Get the index of the highest probability
    max_prob_index = np.argmax(probabilities)
    confidence = float(probabilities[max_prob_index]) * 100
    
    # Decode the label
    predicted_label = _label_encoder.inverse_transform([max_prob_index])[0]

    logger.info(f"Predicted crop: {predicted_label} with {confidence:.2f}% confidence")

    return {
        "crop": predicted_label.capitalize(),
        "confidence_score": round(confidence, 2),
        "short_description": f"Based on your soil parameters, {predicted_label.capitalize()} is the most suitable crop.",
        "suitable_season": "Consult local Krishi Vigyan Kendra (KVK)",
        "water_requirement": "Varies by growth stage; ensure proper drainage",
        "fertilizer_recommendation": "Apply fertilizer based on fresh Soil Health Card"
    }
