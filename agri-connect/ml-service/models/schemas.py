from pydantic import BaseModel, Field

class SoilData(BaseModel):
    nitrogen: float = Field(..., ge=0, description="Nitrogen content in soil (kg/ha)")
    phosphorus: float = Field(..., ge=0, description="Phosphorus content in soil (kg/ha)")
    potassium: float = Field(..., ge=0, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The chat message")
    language: str = Field(default="en", description="Target language for response")
