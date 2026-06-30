from fastapi import FastAPI
from pydantic import BaseModel
import random
import time

app = FastAPI(title="AgriConnect ML Service")

# Mock database of crop profiles based on generic Indian farming conditions
CROP_DATABASE = {
    "rice": {
        "suitable_season": "Kharif (Monsoon)",
        "water_requirement": "High (100-200 cm)",
        "fertilizer_recommendation": "High N (100kg/ha), Medium P&K",
        "short_description": "A major staple crop requiring standing water and high humidity."
    },
    "wheat": {
        "suitable_season": "Rabi (Winter)",
        "water_requirement": "Medium (50-100 cm)",
        "fertilizer_recommendation": "High N (120kg/ha), Medium P, Low K",
        "short_description": "A staple winter crop preferring cool temperatures during early growth."
    },
    "maize": {
        "suitable_season": "Kharif / Zaid",
        "water_requirement": "Medium (50-80 cm)",
        "fertilizer_recommendation": "High NPK balance",
        "short_description": "A versatile cereal crop that requires well-drained soil."
    },
    "cotton": {
        "suitable_season": "Kharif",
        "water_requirement": "Medium (70-120 cm)",
        "fertilizer_recommendation": "High N, Medium P, High K",
        "short_description": "A major cash crop thriving in black soil with long frost-free periods."
    },
    "sugarcane": {
        "suitable_season": "Perennial (Planted in Spring/Autumn)",
        "water_requirement": "Very High (150-250 cm)",
        "fertilizer_recommendation": "Very High NPK, organic manure",
        "short_description": "A long-duration cash crop requiring heavy watering and rich soil."
    },
    "chickpea": {
        "suitable_season": "Rabi",
        "water_requirement": "Low (30-40 cm)",
        "fertilizer_recommendation": "Low N, Medium P",
        "short_description": "A winter pulse crop that fixes soil nitrogen naturally."
    }
}

class SoilData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

def predict_crop(data: SoilData):
    """
    Mock ML prediction logic based on basic agronomical rules.
    In a real app, this would use a loaded scikit-learn model like:
    model.predict([[data.nitrogen, ...]])
    """
    n, p, k, t, h, ph, r = (data.nitrogen, data.phosphorus, data.potassium, 
                            data.temperature, data.humidity, data.ph, data.rainfall)
    
    # Basic logic tree to simulate model
    predicted = "maize"
    
    if r > 150 and h > 70 and t > 22:
        predicted = "rice"
    elif t < 20 and r < 80:
        if n < 50:
            predicted = "chickpea"
        else:
            predicted = "wheat"
    elif r > 100 and t > 25 and ph > 6.0:
        predicted = "sugarcane"
    elif t > 25 and h < 70 and ph > 6.5:
        predicted = "cotton"
    
    # Calculate a mock confidence score (e.g. 75% - 98%)
    confidence_score = round(random.uniform(75.0, 98.5), 1)
    
    profile = CROP_DATABASE.get(predicted, {
        "suitable_season": "Variable",
        "water_requirement": "Moderate",
        "fertilizer_recommendation": "Standard NPK",
        "short_description": "A standard crop suitable for these conditions."
    })
    
    return {
        "crop": predicted,
        "confidence_score": confidence_score,
        "suitable_season": profile["suitable_season"],
        "water_requirement": profile["water_requirement"],
        "fertilizer_recommendation": profile["fertilizer_recommendation"],
        "short_description": profile["short_description"]
    }

@app.post("/predict")
async def get_crop_recommendation(data: SoilData):
    # Simulate processing time for realistic UI loading state
    time.sleep(1.5)
    
    result = predict_crop(data)
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "agriconnect-ml"}
