from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models.schemas import SoilData
from services.crop_service import load_models, predict_crop
from utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI ML Service...")

    try:
        load_models()
        logger.info("ML models loaded successfully.")

    except Exception as e:
        logger.error(f"Failed to load ML models during startup: {e}")
        # Do not crash the application.
        # /health should still remain available.

    yield

    # Shutdown
    logger.info("Shutting down FastAPI ML Service...")


app = FastAPI(
    title="AgriConnect ML API",
    version="1.0.0",
    lifespan=lifespan
)


# =========================================================
# CORS Middleware
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Health Check
# Supports both GET and HEAD requests.
# UptimeRobot can use HEAD on the free plan.
# =========================================================

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {
        "status": "healthy",
        "service": "agriconnect-ml"
    }


# =========================================================
# Version
# =========================================================

@app.get("/version")
async def version():
    return {
        "version": "1.0.0"
    }


# =========================================================
# Crop Prediction
# =========================================================

@app.post("/predict")
async def get_crop_recommendation(data: SoilData):

    logger.info(
        f"Received prediction request: "
        f"temp={data.temperature}, "
        f"humidity={data.humidity}, "
        f"rainfall={data.rainfall}"
    )

    try:
        result = predict_crop(data)
        return result

    except Exception as e:
        logger.error(f"Prediction failed: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )