from utils.logger import logger

def generate_agricultural_response(message: str, language: str = "en") -> str:
    """
    Fallback ML service chat logic for basic agricultural responses.
    This replaces the hardcoded logic that was in main.py.
    """
    logger.info(f"Generating fallback response for language: {language}")
    
    msg_lower = message.lower()
    
    if "wheat" in msg_lower or "seed" in msg_lower:
        reply = (
            "🌾 **Wheat Cultivation Tips:**\n\n"
            "• **Sowing Time:** Best sown between October and November.\n"
            "• **Seed Rate:** 100-125 kg/ha for normal sowing.\n"
            "• **Irrigation:** Requires 4-6 irrigations at critical stages (Crown Root Initiation, Tillering, Jointing, Flowering, Milking, Dough).\n"
            "• **Fertilizer:** N:P:K ratio of 120:60:40 kg/ha is generally recommended."
        )
    elif "pest" in msg_lower or "insect" in msg_lower or "disease" in msg_lower:
        reply = (
            "🐛 **General Pest Management:**\n\n"
            "• **Prevention:** Practice crop rotation and maintain field hygiene.\n"
            "• **Biological Control:** Use Neem oil extract (5%) as a preventive measure.\n"
            "• **Chemical Control:** Only use approved pesticides when pest population crosses the Economic Threshold Level (ETL).\n"
            "• Consult your local KVK (Krishi Vigyan Kendra) for exact identification."
        )
    elif "fertilizer" in msg_lower or "urea" in msg_lower or "nitrogen" in msg_lower:
        reply = (
            "🧪 **Fertilizer Application:**\n\n"
            "• Always base fertilizer application on a recent **Soil Health Card** test.\n"
            "• **Urea Application:** Split nitrogen doses. Apply 1/3 at sowing, 1/3 at active tillering, and 1/3 at panicle initiation.\n"
            "• Top-dress remaining Nitrogen during first and second irrigations."
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
        
    return reply
