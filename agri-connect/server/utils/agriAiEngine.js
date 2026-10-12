// AgriBot Agricultural Intelligence Engine
// Provides expert farming, pest, crop, fertilizer, irrigation & scheme guidance

const LANGUAGE_GREETINGS = {
  en: "Namaste! I am AgriBot, your personal agricultural AI assistant 🌾. How can I assist you with your crops, soil, pests, or farming schemes today?",
  hi: "नमस्ते! मैं एग्रीबॉट (AgriBot) हूँ, आपका कृषि AI सहायक 🌾। आज मैं आपकी फसलों, खाद, कीट नियंत्रण या सरकारी योजनाओं में क्या मदद कर सकता हूँ?",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੀਬੋਟ (AgriBot) ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ AI ਸਹਾਇਕ 🌾। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਫ਼ਸਲ, ਖਾਦ, ਕੀੜੇ-ਮਕੌੜੇ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
  mr: "नमस्कार! मी अ‍ॅग्रीबॉट (AgriBot), आपला कृषी AI सहाय्यक 🌾. आज मी आपल्या पिकांसाठी, खतांसाठी किंवा सरकारी योजनांसाठी काय मदत करू शकतो?",
  gu: "નમસ્તે! હું એગ્રીબોટ (AgriBot) છું, તમારો કૃષિ AI સહાયક 🌾. આજે હું તમારા પાક, ખાતર, જીવાત નિયંત્રણ અથવા સરકારી યોજનાઓમાં કેવી રીતે મદદ કરી શકું?",
  bn: "নমস্কার! আমি এগ্রিবট (AgriBot), আপনার কৃষি AI সহকারী 🌾। আজ আমি আপনার ফসল, সার, রোগবালাই দমন বা সরকারি প্রকল্পে কীভাবে সাহায্য করতে পারি?",
  ta: "வணக்கம்! நான் அக்ரிபாட் (AgriBot), உங்கள் விவசாய AI உதவியாளர் 🌾. பயிர்கள், உரங்கள், பூச்சி கட்டுப்பாடு அல்லது அரசு திட்டங்கள் குறித்து உங்களுக்கு எவ்வாறு உதவ முடியும்?",
  te: "నమస్కారం! నేను అగ్రిబాట్ (AgriBot), మీ వ్యవసాయ AI సహాయకుడిని 🌾. మీ పంటలు, ఎరువులు, తెగుళ్ల నివారణ లేదా ప్రభుత్వ పథకాలపై నేను ఎలా సహాయపడగలను?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಬಾಟ್ (AgriBot), ನಿಮ್ಮ ಕೃಷಿ AI ಸಹಾಯಕ 🌾. ನಿಮ್ಮ ಬೆಳೆಗಳು, ಗೊಬ್ಬರ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  ml: "നമസ്കാരം! ഞാൻ അഗ്രിബോട്ട് (AgriBot), നിങ്ങളുടെ കാർഷിക AI സഹായി 🌾. നിങ്ങളുടെ വിളകൾ, വളങ്ങൾ, കീടനിയന്ത്രണം എന്നിവയിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?",
  or: "ନମସ୍କାର! ମୁଁ ଏଗ୍ରିବଟ୍ (AgriBot), ଆପଣଙ୍କର କୃଷି AI ସହାୟକ 🌾। ଆଜି ଆପଣଙ୍କ ଫସଲ, ଖତ, କୀଟନାଶକ କିମ୍ବା ସରକାରୀ ଯୋଜନା ବିଷୟରେ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?"
};

function generateAgriResponse(query, lang = 'en') {
  const q = (query || '').toLowerCase().trim();
  const currentLang = LANGUAGE_GREETINGS[lang] ? lang : 'en';

  // 1. Greetings
  if (/^(hi|hello|hey|namaste|namaskar|sat sri akal|pranam|halo|start)/i.test(q) && q.length < 25) {
    return {
      text: LANGUAGE_GREETINGS[currentLang] || LANGUAGE_GREETINGS.en,
      category: 'greeting'
    };
  }

  // 2. Yellow leaves / Nutrient deficiency
  if (q.includes('yellow') || q.includes('पीली') || q.includes('ਪੀਲੇ') || q.includes('chlorosis') || q.includes('deficiency') || q.includes('पत्ते')) {
    if (currentLang === 'hi') {
      return {
        text: `### 🌾 पत्तियों के पीले पड़ने का कारण और उपचार

पत्तियों का पीला पड़ना आमतौर पर पोषक तत्वों की कमी या जड़ में समस्या के कारण होता है:

1. **नाइट्रोजन (Nitrogen) की कमी:**
   - यदि निचली (पुरानी) पत्तियां पहले पीली हो रही हैं, तो यह नाइट्रोजन की कमी है।
   - **उपचार:** 10-15 ग्राम यूरिया प्रति लीटर पानी में घोलकर छिड़काव करें या सिंचाई के साथ हल्की यूरिया दें।

2. **जिंक / आयरन (Zinc/Iron) की कमी:**
   - यदि नई (ऊपरी) पत्तियां नसों के बीच पीली पड़ रही हैं।
   - **उपचार:** 0.5% जिंक सल्फेट (5 ग्राम) + 2.5 ग्राम बुझा हुआ चूना प्रति लीटर पानी में मिलाकर स्प्रे करें।

3. **अत्यधिक पानी / जड़ गलन:**
   - खेत से अतिरिक्त पानी निकालें और जल निकासी सुनिश्चित करें।`,
        category: 'nutrient_deficiency'
      };
    } else if (currentLang === 'pa') {
      return {
        text: `### 🌾 ਪੱਤਿਆਂ ਦੇ ਪੀਲੇ ਹੋਣ ਦਾ ਕਾਰਨ ਅਤੇ ਹੱਲ

1. **ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ:**
   - ਜੇਕਰ ਹੇਠਲੇ ਪੱਤੇ ਪਹਿਲਾਂ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ।
   - **ਹੱਲ:** 10-15 ਗ੍ਰਾਮ ਯੂਰੀਆ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।

2. **ਜ਼ਿੰਕ ਦੀ ਕਮੀ:**
   - ਨਵੇਂ ਪੱਤੇ ਨਸਾਂ ਦੇ ਵਿਚਕਾਰੋਂ ਪੀਲੇ ਹੁੰਦੇ ਹਨ।
   - **ਹੱਲ:** 5 ਗ੍ਰਾਮ ਜ਼ਿੰਕ ਸਲਫੇਟ (21%) ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।

3. **ਪਾਣੀ ਦਾ ਖੜ੍ਹਾ ਰਹਿਣਾ:**
   - ਖੇਤ ਵਿੱਚੋਂ ਵਾਧੂ ਪਾਣੀ ਤੁਰੰਤ ਕੱਢੋ।`,
        category: 'nutrient_deficiency'
      };
    } else {
      return {
        text: `### 🌾 Causes of Yellowing Leaves & Treatment

Yellow leaves usually indicate nutrient imbalance or over-watering:

1. **Nitrogen (N) Deficiency:**
   - **Symptom:** Older (lower) leaves turn yellow first while upper leaves remain pale green.
   - **Remedy:** Apply a foliar spray of 1-2% Urea (10-15 g per liter of water) or top-dress with nitrogen during irrigation.

2. **Zinc or Iron Deficiency:**
   - **Symptom:** Younger (upper) leaves show interveinal yellowing (veins stay green).
   - **Remedy:** Spray Zinc Sulphate (0.5% = 5g/L) mixed with 2.5g slaked lime, or Chelated Iron spray.

3. **Waterlogging / Poor Drainage:**
   - Excess moisture suffocates roots. Ensure proper field drainage immediately.`,
        category: 'nutrient_deficiency'
      };
    }
  }

  // 3. Pest / Insect / Worm control
  if (q.includes('pest') || q.includes('insect') || q.includes('borer') || q.includes('aphid') || q.includes('कीट') || q.includes('कीड़ा') || q.includes('ਸੁੰਡੀ') || q.includes('spray') || q.includes('neem')) {
    if (currentLang === 'hi') {
      return {
        text: `### 🐛 कीट एवं सुंडी नियंत्रण के प्रभावी उपाय

1. **प्राकृतिक / जैविक नियंत्रण (Organic Control):**
   - **नीम का तेल (Neem Oil):** 10,000 PPM नीम तेल 3-5 मिली प्रति लीटर पानी में मिलाकर शाम के समय छिड़कें।
   - **येलो स्टिकी ट्रैप (Yellow Sticky Traps):** रस चूसक कीटों (माहू, सफेद मक्खी) के लिए प्रति एकड़ 6-8 ट्रैप लगाएं।

2. **सुंडी / तना छेदक (Stem Borer / Spodoptera):**
   - **रासायनिक उपचार:** कोराजन (Coragen / Chlorantraniliprole 18.5% SC) 0.3-0.4 मिली प्रति लीटर या कार्टाप हाइड्रोक्लोराइड 50 SP 2 ग्राम प्रति लीटर पानी।

3. **सावधानी:**
   - छिड़काव हमेशा सुबह या शाम के समय करें जब धूप कम हो।
   - मधुमक्खियों के समय तेज कीटनाशकों का प्रयोग न करें।`,
        category: 'pest_control'
      };
    } else {
      return {
        text: `### 🐛 Integrated Pest Management (IPM) & Crop Protection

Here is the recommended protocol to manage pests safely and effectively:

1. **Organic / Eco-Friendly Remedies:**
   - **Neem Oil Spray:** Use 10,000 PPM Neem Oil @ 3-5 ml per liter of water with a few drops of liquid soap as a surfactant.
   - **Yellow / Blue Sticky Traps:** Install 6-8 traps per acre to monitor and capture whiteflies, aphids, and thrips.
   - **Pheromone Traps:** 4-5 traps per acre for fall armyworm or fruit borer monitoring.

2. **Targeted Chemical Remedies (When ETL is Crossed):**
   - **Sucking Pests (Aphids, Jassids, Whitefly):** Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.
   - **Chewing Caterpillars / Stem Borers:** Chlorantraniliprole (Coragen) @ 0.4 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L.

3. **Best Practices:**
   - Spray during early morning or late afternoon to prevent bee toxicity and volatilization.`,
        category: 'pest_control'
      };
    }
  }

  // 4. Fertilizer / Urea / DAP / NPK
  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('npk') || q.includes('खाद') || q.includes('ਖਾਦ') || q.includes('manure') || q.includes('potash')) {
    if (currentLang === 'hi') {
      return {
        text: `### 🧪 फसल के लिए संतुलित उर्वरक (Fertilizer Management)

1. **संतुलित अनुपात (Balanced Ratio):**
   - अनाज वाली फसलों (गेहूं, धान, मक्का) के लिए आदर्श N:P:K अनुपात **4:2:1** होता है।
   - दलहनी फसलों (दालें) के लिए आदर्श अनुपात **1:2:1** होता है।

2. **उर्वरक उपयोग के नियम:**
   - **DAP / SSP (फास्फोरस):** हमेशा बुवाई के समय बेसल डोज के रूप में जमीन में डालें।
   - **यूरिया (नाइट्रोजन):** 2 से 3 बराबर भागों में बांटकर पहली और दूसरी सिंचाई के बाद छिड़कें।
   - **पोटाश (MOP):** दानों की चमक, वजन और रोग प्रतिरोधक क्षमता बढ़ाने के लिए आवश्यक है।

3. **जैविक खाद:**
   - बुवाई से 3-4 सप्ताह पहले 4-5 टन गोबर की सड़ी खाद (FYM) या 2 टन वर्मीकम्पोस्ट प्रति एकड़ अवश्य मिलाएं।`,
        category: 'fertilizer'
      };
    } else {
      return {
        text: `### 🧪 Balanced Fertilizer Application Guide

Maximizing yield while preserving soil health requires balanced nutrition:

1. **Primary Nutrient Balance (N:P:K):**
   - **Cereals (Paddy, Wheat, Maize):** Target standard 4:2:1 ratio (approx. 100-120 kg N, 50-60 kg P2O5, 40-50 kg K2O per hectare).
   - **Pulses (Chickpea, Moong, Urad):** Target 1:2:1 ratio (Pulses fix atmospheric Nitrogen; focus on Phosphorus).

2. **Timing of Application:**
   - **Basal Dose (At Sowing):** Entire Phosphorus (DAP/SSP), entire Potash (MOP), and 1/3rd of Nitrogen.
   - **Top Dressing (Split Doses):** Remaining Nitrogen in 2 equal splits coinciding with critical irrigation timings.

3. **Micronutrient Boost:**
   - Apply 25 kg Zinc Sulphate (21%) per hectare once every 2 years to prevent stunting and yellowing.`,
        category: 'fertilizer'
      };
    }
  }

  // 5. Government Schemes / PM-Kisan / KCC / Subsidy
  if (q.includes('scheme') || q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('kcc') || q.includes('loan') || q.includes('subsidy') || q.includes('योजना') || q.includes('ਸਕੀਮ') || q.includes('fasal bima') || q.includes('insurance')) {
    if (currentLang === 'hi') {
      return {
        text: `### 🏛️ प्रमुख सरकारी किसान योजनाएं एवं लाभ

1. **पीएम किसान सम्मान निधि (PM-KISAN):**
   - सभी पात्र भूमिधारक किसानों को हर साल **₹6,000** की प्रत्यक्ष वित्तीय सहायता (₹2,000 की 3 किस्तों में)।
   - पोर्टल: [pmkisan.gov.in](https://pmkisan.gov.in) (ई-केवाईसी आधार लिंक अनिवार्य है)।

2. **किसान क्रेडिट कार्ड (KCC Loan):**
   - बिना किसी गारंटी के ₹1.60 लाख तक और कुल ₹3 लाख तक का कृषि ऋण मात्र **4% ब्याज दर** (समय पर भुगतान पर)।
   - आवेदन निकटतम बैंक शाखा या जन सेवा केंद्र (CSC) पर करें।

3. **प्रधानमंत्री फसल बीमा योजना (PMFBY):**
   - प्राकृतिक आपदाओं से फसल नुकसान पर न्यूनतम प्रीमियम (खरीफ: 2%, रबी: 1.5%, बागवानी: 5%) पर पूरा बीमा कवरेज।

4. **पीएम कुसुम योजना (Solar Pump Subsidy):**
   - सोलर वाटर पंप लगाने पर केंद्र और राज्य सरकार द्वारा **60% तक सब्सिडी** दी जाती है।`,
        category: 'government_schemes'
      };
    } else {
      return {
        text: `### 🏛️ Key Government Agricultural Schemes & Subsidies

1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi):**
   - Direct income support of **₹6,000 per year** transferred in 3 equal installments of ₹2,000 directly to farmer bank accounts.
   - Portal: [pmkisan.gov.in](https://pmkisan.gov.in) (Mandatory: Aadhaar eKYC).

2. **Kisan Credit Card (KCC):**
   - Concessional short-term crop loans up to ₹3,00,000 at an effective **4% interest rate** upon timely repayment.
   - Collateral-free limit up to ₹1,60,000.

3. **PM Fasal Bima Yojana (PMFBY):**
   - Comprehensive crop insurance covering natural calamities, drought, floods, and unseasonal rainfall.
   - Subsidized farmer premium: 2% for Kharif crops, 1.5% for Rabi crops.

4. **PM-KUSUM Scheme (Solar Pumps):**
   - Up to **60% capital subsidy** to install off-grid solar irrigation pumps, replacing diesel generators.`,
        category: 'government_schemes'
      };
    }
  }

  // 6. Irrigation / Water
  if (q.includes('irrigation') || q.includes('water') || q.includes('drip') || q.includes('sprinkler') || q.includes('सिंचाई') || q.includes('ਪਾਣੀ')) {
    if (currentLang === 'hi') {
      return {
        text: `### 💧 आधुनिक सिंचाई तकनीक और जल प्रबंधन

1. **ड्रिप सिंचाई (टपक सिंचाई - Drip Irrigation):**
   - पानी की **50-70% बचत** और उपज में 30-40% की वृद्धि।
   - फलदार पौधों, सब्जियों और कपास, गन्ने के लिए सबसे उपयुक्त।
   - सरकार द्वारा 'प्रति बूंद अधिक फसल' (PMKSY) के तहत 55% तक सब्सिडी उपलब्ध है।

2. **स्प्रिंकलर (फव्वारा सिंचाई):**
   - गेहूं, चना, सरसों और दालों के लिए आदर्श।
   - असमतल भूमि और रेतीली मिट्टी में सबसे प्रभावी।

3. **सिंचाई के महत्वपूर्ण चरण:**
   - **गेहूं:** पहली सिंचाई 21 दिन पर (CRI स्टेज) अवश्य करें।
   - **धान:** फूल आने और दाना भरते समय खेत में नमी बनी रहनी चाहिए।`,
        category: 'irrigation'
      };
    } else {
      return {
        text: `### 💧 Smart Irrigation & Water Management

1. **Drip Irrigation:**
   - Saves **50-70% water** while delivering water and soluble nutrients directly to root zones.
   - Ideal for orchards, vegetables, sugarcane, and cotton.
   - Supported by government subsidies under PMKSY (Per Drop More Crop) up to 55-70%.

2. **Sprinkler Irrigation:**
   - Best for close-growing crops like wheat, mustard, pulses, and groundnut.
   - Excellent for undulating terrain where flood irrigation causes soil erosion.

3. **Critical Stages for Watering:**
   - **Wheat:** Crown Root Initiation (CRI) at 21 days after sowing is critical; delaying reduces yield by 20%.
   - **Rice:** Panicle initiation and flowering stage require consistent 2-5 cm standing water.`,
        category: 'irrigation'
      };
    }
  }

  // 7. Crop recommendation / Season planting
  if (q.includes('crop') || q.includes('grow') || q.includes('sow') || q.includes('फसल') || q.includes('ਫ਼ਸਲ') || q.includes('seed') || q.includes('बीज')) {
    if (currentLang === 'hi') {
      return {
        text: `### 🌱 फसल चयन एवं मौसम अनुसार बुवाई सलाह

1. **रबी मौसम (अक्टूबर - मार्च):**
   - **मुख्य फसलें:** गेहूं (Wheat), सरसों (Mustard), चना (Chickpea), मटर, आलू।
   - **तापमान:** 15°C - 25°C, कम आर्द्रता और मध्यम पानी।

2. **खरीफ मौसम (जून - अक्टूबर):**
   - **मुख्य फसलें:** धान (Paddy), मक्का (Maize), कपास (Cotton), बाजरा, सोयाबीन।
   - **तापमान:** 25°C - 35°C, उच्च आर्द्रता और भरपूर मानसूनी वर्षा।

3. **जायद / ग्रीष्मकालीन (मार्च - जून):**
   - **मुख्य फसलें:** तरबूज, खरबूजा, खीरा, मूंग दाल, उड़द।

💡 *सुझाव: सटीक सिफारिश के लिए हमारे **Crop Advisor** टूल में अपनी मिट्टी का N-P-K और मौसम का विवरण दर्ज करें!*`,
        category: 'crop_selection'
      };
    } else {
      return {
        text: `### 🌱 Seasonal Crop Selection & Sowing Advice

1. **Rabi Season (Winter / October to March):**
   - **Top Choices:** Wheat, Mustard, Chickpea, Lentil, Barley, Potato.
   - **Conditions:** Cool weather (15°C - 24°C) with dry sunny maturity period.

2. **Kharif Season (Monsoon / June to October):**
   - **Top Choices:** Paddy/Rice, Maize, Cotton, Soybean, Pigeonpea (Tur), Groundnut.
   - **Conditions:** Warm, humid climate (25°C - 35°C) aligned with monsoon rainfall.

3. **Zaid Season (Summer / March to June):**
   - **Top Choices:** Watermelon, Muskmelon, Cucumber, Summer Moong, Fodder crops.

💡 *Pro Tip: Use the **Crop Advisor** page on the sidebar to get instant AI recommendations tailored to your exact soil Nitrogen, Phosphorus, Potassium, and pH test values!*`,
        category: 'crop_selection'
      };
    }
  }

  // 8. General agricultural advisory fallback
  if (currentLang === 'hi') {
    return {
      text: `### 🌾 एग्रीबॉट कृषि परामर्श (AgriBot Advisory)

आपके प्रश्न "${query}" के संबंध में मुख्य कृषि सुझाव:

1. **मिट्टी परीक्षण:** किसी भी फसल या उर्वरक के प्रयोग से पहले मृदा स्वास्थ्य कार्ड (Soil Health Card) के अनुसार ही N-P-K और सूक्ष्म पोषक तत्वों का उपयोग करें।
2. **सटीक कीट प्रबंधन:** कीटों या रोगों की प्रारंभिक अवस्था में ही नीम के तेल या अनुशंसित जैविक उपायों का प्रयोग करें।
3. **जल दक्षता:** ड्रिप या स्प्रिंकलर सिंचाई अपनाएं जिससे पानी और बिजली दोनों की बचत हो सके।
4. **मौसम पूर्वानुमान:** बुवाई और कीटनाशक छिड़काव से पहले हमारे **Weather Forecast** पेज पर आगामी 5 दिनों का मौसम अवश्य देखें।

यदि आप किसी विशिष्ट फसल (जैसे गेहूं, धान, कपास) या बीमारी के बारे में जानना चाहते हैं, तो कृपया उसका नाम बताएं!`,
      category: 'general'
    };
  }

  return {
    text: `### 🌾 AgriBot Advisory & Farmer Support

Regarding your query: **"${query}"**

1. **Soil & Nutrients:** Always apply fertilizers (Urea, DAP, MOP) based on a recent Soil Health Card test to prevent soil salinity and save input costs.
2. **Integrated Pest Management:** Inspect under-leaf surfaces twice a week. Use Neem-based bio-pesticides or pheromone traps at the first sign of pest infestation.
3. **Water Management:** Adopt micro-irrigation (Drip/Sprinkler) to conserve groundwater and enhance fertilizer uptake through fertigation.
4. **Weather Updates:** Check the **Weather Forecast** module on AgriConnect before scheduling foliar spraying or harvesting.

Feel free to ask specific questions about any crop (e.g., *Rice, Wheat, Cotton, Tomato*), pest control, fertilizer calculation, or government subsidies!`,
    category: 'general'
  };
}

module.exports = {
  generateAgriResponse,
  LANGUAGE_GREETINGS
};
