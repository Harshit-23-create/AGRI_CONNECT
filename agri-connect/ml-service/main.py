from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models.schemas import SoilData, ChatRequest
from services.crop_service import load_models, predict_crop
from services.chat_service import generate_agricultural_response
from utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI ML Service...")
    try:
        load_models()
    except Exception as e:
        logger.error(f"Failed to load ML models during startup: {e}")
        # We don't crash here so /health can still report
    yield
    # Shutdown
    logger.info("Shutting down FastAPI ML Service...")

app = FastAPI(title="AgriConnect ML API", version="1.0.0", lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "agriconnect-ml"}

@app.get("/version")
async def version():
    return {"version": "1.0.0"}

@app.post("/predict")
async def get_crop_recommendation(data: SoilData):
    logger.info(f"Received prediction request: temp={data.temperature}, humidity={data.humidity}, rainfall={data.rainfall}")
    try:
        result = predict_crop(data)
        return result
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/chat")
async def chat_with_agribot(data: ChatRequest):
    logger.info(f"Received AI Chat query: {data.message[:50]}... in {data.language}")
    reply = generate_agricultural_response(data.message.strip(), data.language)
    return {
        "reply": reply,
        "provider": "FastAPI Agricultural AI",
        "service": "agriconnect-ml"
    }
