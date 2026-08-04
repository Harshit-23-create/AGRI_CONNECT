from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random
import time
import logging
import urllib.request
import urllib.parse
import json

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("agriconnect-ml")

app = FastAPI(title="AgriConnect ML Service")

# Enable CORS for cross-origin integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    language: Optional[str] = 'en'

def predict_crop(data: SoilData):
    n, p, k, t, h, ph, r = (data.nitrogen, data.phosphorus, data.potassium, 
                            data.temperature, data.humidity, data.ph, data.rainfall)
    
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

def translate_text(text: str, target_lang: str) -> str:
    if target_lang == 'en':
        return text
    try:
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            translated = "".join([item[0] for item in data[0] if item[0]])
            return translated if translated else text
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        return text

def generate_agricultural_response(message: str, language: str = 'en') -> str:
    msg_lower = message.lower()
    
    if "rainy" in msg_lower or "monsoon" in msg_lower or "kharif" in msg_lower:
        reply = (
            "🌾 **Kharif (Monsoon) Season Crop Advice:**\n\n"
            "• **Recommended Crops:** Paddy (Rice), Maize, Cotton, Soybean, and Turmeric.\n"
            "• **Key Tips:** Ensure effective field drainage to avoid root waterlogging during heavy rainfall. "
            "Apply nitrogenous fertilizers in split doses."
        )
    elif "aphid" in msg_lower or "pest" in msg_lower or "insect" in msg_lower:
        reply = (
            "🐛 **Eco-Friendly Pest Management:**\n\n"
            "• **Natural Control:** Spray Neem Oil solution (5ml/L of water with mild detergent).\n"
            "• **Biological Control:** Encourage natural predators like Ladybird Beetles.\n"
            "• **Cultural Practice:** Use yellow sticky traps to control aphid populations early."
        )
    elif "fertilizer" in msg_lower or "npk" in msg_lower or "wheat" in msg_lower:
        reply = (
            "🌱 **Fertilizer & Soil Nutrition Guidance:**\n\n"
            "• **Wheat Crop:** Standard NPK ratio of **120:60:40 kg/ha**.\n"
            "• **Timing:** Apply full Phosphorus & Potassium + 50% Nitrogen during basal sowing. "
            "Top-dress remaining Nitrogen during first and second irrigations."
        )
    elif "fertility" in msg_lower or "soil" in msg_lower or "compost" in msg_lower:
        reply = (
            "🍂 **Improving Soil Health & Fertility:**\n\n"
            "• Incorporate Well-rotted Farmyard Manure (FYM) or Vermicompost (5-10 tonnes/ha).\n"
            "• Practice Crop Rotation with nitrogen-fixing Legumes (Chickpea, Moong, Cowpea).\n"
            "• Sow green manure crops like Sesbania (Dhaincha) prior to planting."
        )
    elif "rice" in msg_lower or "harvest" in msg_lower or "paddy" in msg_lower:
        reply = (
            "🌾 **Harvesting Advice:**\n\n"
            "• **Harvest Timing:** Harvest when 80-85% of grains turn straw yellow/golden.\n"
            "• **Moisture Level:** Ideal grain moisture at harvest is **20-25%**. Dry grains to 12-14% before storage."
        )
    else:
        reply = (
            "🤖 **AgriBot Agricultural Assistant:**\n\n"
            f"Thank you for reaching out! Regarding your query: *\"{message}\"*\n\n"
            "• For optimal yield, always conduct a **Soil Health Card Test** before seasonal planting.\n"
            "• Ensure proper irrigation scheduling aligned with local weather forecasts.\n"
            "• Feel free to ask specifically about crop selection, pest control, fertilizers, or government farming schemes!"
        )
    return translate_text(reply, language)

@app.post("/predict")
async def get_crop_recommendation(data: SoilData):
    logger.info(f"Received prediction request: temp={data.temperature}, humidity={data.humidity}, rainfall={data.rainfall}")
    import asyncio
    await asyncio.sleep(0.1) # Reduced artificial delay
    result = predict_crop(data)
    return result

@app.post("/chat")
async def chat_with_agribot(data: ChatRequest):
    logger.info(f"Received AI Chat query: {data.message[:50]}... in {data.language}")
    if not data.message or not data.message.strip():
        raise HTTPException(status_code=400, detail="Message string cannot be empty")
    
    reply = generate_agricultural_response(data.message.strip(), data.language)
    return {
        "reply": reply,
        "provider": "FastAPI Agricultural AI",
        "service": "agriconnect-ml"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "agriconnect-ml"}
