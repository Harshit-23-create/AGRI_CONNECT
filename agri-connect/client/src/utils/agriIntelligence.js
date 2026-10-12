// Client-Side Resilient Agronomic & Chatbot Intelligence
// Provides offline-capable, instant responses for Crop Advisor & AI Chat

export const CROP_CENTROIDS = {
  rice: { N: 79.89, P: 47.58, K: 39.87, temperature: 23.69, humidity: 82.27, ph: 6.43, rainfall: 236.18 },
  maize: { N: 77.76, P: 48.44, K: 19.79, temperature: 22.39, humidity: 65.09, ph: 6.25, rainfall: 84.77 },
  chickpea: { N: 40.09, P: 67.79, K: 79.92, temperature: 18.87, humidity: 16.86, ph: 7.34, rainfall: 80.06 },
  kidneybeans: { N: 20.75, P: 67.54, K: 20.05, temperature: 20.12, humidity: 21.61, ph: 5.75, rainfall: 105.92 },
  pigeonpeas: { N: 20.73, P: 67.73, K: 20.29, temperature: 27.74, humidity: 48.06, ph: 5.79, rainfall: 149.46 },
  mothbeans: { N: 21.44, P: 48.01, K: 20.23, temperature: 28.19, humidity: 53.16, ph: 6.83, rainfall: 51.2 },
  mungbean: { N: 20.99, P: 47.28, K: 19.87, temperature: 28.53, humidity: 85.5, ph: 6.72, rainfall: 48.4 },
  blackgram: { N: 40.02, P: 67.47, K: 19.24, temperature: 29.97, humidity: 65.12, ph: 7.13, rainfall: 67.88 },
  lentil: { N: 18.77, P: 68.36, K: 19.41, temperature: 24.51, humidity: 64.8, ph: 6.93, rainfall: 45.68 },
  pomegranate: { N: 18.87, P: 18.75, K: 40.21, temperature: 21.84, humidity: 90.13, ph: 6.43, rainfall: 107.53 },
  banana: { N: 100.23, P: 82.01, K: 50.05, temperature: 27.38, humidity: 80.36, ph: 5.98, rainfall: 104.63 },
  mango: { N: 20.07, P: 27.18, K: 29.92, temperature: 31.21, humidity: 50.16, ph: 5.77, rainfall: 94.7 },
  grapes: { N: 23.18, P: 132.53, K: 200.11, temperature: 23.85, humidity: 81.88, ph: 6.03, rainfall: 69.61 },
  watermelon: { N: 99.42, P: 17.0, K: 50.22, temperature: 25.59, humidity: 85.16, ph: 6.5, rainfall: 50.79 },
  muskmelon: { N: 100.32, P: 17.72, K: 50.08, temperature: 28.66, humidity: 92.34, ph: 6.36, rainfall: 24.69 },
  apple: { N: 20.8, P: 134.22, K: 199.89, temperature: 22.63, humidity: 92.33, ph: 5.93, rainfall: 112.65 },
  orange: { N: 19.58, P: 16.55, K: 10.01, temperature: 22.77, humidity: 92.17, ph: 7.02, rainfall: 110.47 },
  papaya: { N: 49.88, P: 59.05, K: 50.04, temperature: 33.72, humidity: 92.4, ph: 6.74, rainfall: 142.63 },
  coconut: { N: 21.98, P: 16.93, K: 30.59, temperature: 27.41, humidity: 94.84, ph: 5.98, rainfall: 175.69 },
  cotton: { N: 117.77, P: 46.24, K: 19.56, temperature: 23.99, humidity: 79.84, ph: 6.91, rainfall: 80.4 },
  jute: { N: 78.4, P: 46.86, K: 39.99, temperature: 24.96, humidity: 79.64, ph: 6.73, rainfall: 174.79 },
  coffee: { N: 101.2, P: 28.74, K: 29.94, temperature: 25.54, humidity: 58.87, ph: 6.79, rainfall: 158.07 }
};

const FEATURE_STDS = {
  N: 36.9,
  P: 32.9,
  K: 50.6,
  temperature: 5.06,
  humidity: 22.2,
  ph: 0.77,
  rainfall: 54.9
};

const CROP_METADATA = {
  rice: {
    name: 'Rice',
    season: 'Kharif season (June to November)',
    water: 'High (1200-1500 mm) - Maintain 5cm standing water in vegetative stage',
    fertilizer: 'N: 100-120 kg/ha, P2O5: 50-60 kg/ha, K2O: 40-50 kg/ha'
  },
  maize: {
    name: 'Maize',
    season: 'Kharif / Rabi season (June-July or October-November)',
    water: 'Moderate (500-800 mm) - Avoid waterlogging; critical at tasseling',
    fertilizer: 'N: 120 kg/ha, P2O5: 60 kg/ha, K2O: 40 kg/ha'
  },
  chickpea: {
    name: 'Chickpea',
    season: 'Rabi season (October to March)',
    water: 'Low (250-400 mm) - Light irrigation during pod development',
    fertilizer: 'N: 20-25 kg/ha, P2O5: 50-60 kg/ha + Rhizobium inoculation'
  },
  kidneybeans: {
    name: 'Kidney Beans',
    season: 'Spring / Kharif (March-April or June-July)',
    water: 'Moderate (500-600 mm) - Consistent moisture during flowering',
    fertilizer: 'N: 40-50 kg/ha, P2O5: 60-80 kg/ha, K2O: 30-40 kg/ha'
  },
  pigeonpeas: {
    name: 'Pigeonpeas (Arhar / Tur)',
    season: 'Kharif season (June-July sowing)',
    water: 'Moderate (600-800 mm) - High drought tolerance',
    fertilizer: 'N: 20-25 kg/ha, P2O5: 50-60 kg/ha, K2O: 20-30 kg/ha'
  },
  mothbeans: {
    name: 'Moth Beans',
    season: 'Kharif (July sowing) - Arid and semi-arid zones',
    water: 'Low (300-450 mm) - Extremely drought-hardy legume',
    fertilizer: 'N: 10-15 kg/ha, P2O5: 30-40 kg/ha'
  },
  mungbean: {
    name: 'Mungbean (Moong)',
    season: 'Kharif (June-July) / Zaid (March-April)',
    water: 'Low to Moderate (350-500 mm)',
    fertilizer: 'N: 20 kg/ha, P2O5: 40 kg/ha'
  },
  blackgram: {
    name: 'Blackgram (Urad)',
    season: 'Kharif / Summer (June-July or February-March)',
    water: 'Moderate (400-600 mm)',
    fertilizer: 'N: 20-25 kg/ha, P2O5: 40-50 kg/ha, K2O: 20 kg/ha'
  },
  lentil: {
    name: 'Lentil (Masoor)',
    season: 'Rabi season (October-November sowing)',
    water: 'Low (300-400 mm)',
    fertilizer: 'N: 20 kg/ha, P2O5: 40 kg/ha, K2O: 20 kg/ha'
  },
  pomegranate: {
    name: 'Pomegranate',
    season: 'Perennial - Planting July-August or February-March',
    water: 'Moderate (500-700 mm) - Drip irrigation highly recommended',
    fertilizer: 'FYM: 20 kg/plant, N: 500g, P2O5: 250g, K2O: 250g per mature plant'
  },
  banana: {
    name: 'Banana',
    season: 'Year-round in humid tropics (June-July / September-October)',
    water: 'High (1500-2000 mm) - Drip fertigation recommended',
    fertilizer: 'N: 200g, P2O5: 60g, K2O: 300g per plant in split applications'
  },
  mango: {
    name: 'Mango',
    season: 'Perennial - Monsoon planting (July-August)',
    water: 'Moderate - Regular watering during fruit formation',
    fertilizer: 'FYM: 50 kg/tree, N: 1000g, P2O5: 500g, K2O: 1000g per mature tree'
  },
  grapes: {
    name: 'Grapes',
    season: 'Perennial - Pruning in October and April',
    water: 'Moderate (500-700 mm) - Drip irrigation with fertigation',
    fertilizer: 'N: 300-400 kg/ha, P2O5: 150-200 kg/ha, K2O: 400-500 kg/ha'
  },
  watermelon: {
    name: 'Watermelon',
    season: 'Zaid / Summer (January to March sowing)',
    water: 'Moderate (400-600 mm) - Reduce water near harvest',
    fertilizer: 'N: 80-100 kg/ha, P2O5: 50 kg/ha, K2O: 60-80 kg/ha'
  },
  muskmelon: {
    name: 'Muskmelon',
    season: 'Zaid / Summer (February to March sowing)',
    water: 'Moderate (350-500 mm) - Drip irrigation preferred',
    fertilizer: 'N: 80-100 kg/ha, P2O5: 50 kg/ha, K2O: 60 kg/ha'
  },
  apple: {
    name: 'Apple',
    season: 'Temperate / Winter planting (January-February)',
    water: 'Moderate (1000-1200 mm) - Needs 800+ chilling hours',
    fertilizer: 'FYM: 35 kg/tree, N: 700g, P2O5: 350g, K2O: 700g'
  },
  orange: {
    name: 'Orange / Citrus',
    season: 'Monsoon / Spring planting (July-August or February)',
    water: 'Moderate (750-1000 mm) - Avoid waterlogging',
    fertilizer: 'FYM: 25 kg/tree, N: 600g, P2O5: 200g, K2O: 300g per tree'
  },
  papaya: {
    name: 'Papaya',
    season: 'Spring / Monsoon planting (February-March or June-July)',
    water: 'Moderate to High (1000-1400 mm)',
    fertilizer: 'N: 200g, P2O5: 200g, K2O: 250g per plant per year'
  },
  coconut: {
    name: 'Coconut',
    season: 'Perennial - Planting with onset of monsoon (May-June)',
    water: 'High (1300-2300 mm) - Thrives in coastal humid climates',
    fertilizer: 'Urea: 1.3 kg, Rock Phosphate: 2 kg, MOP: 2 kg per palm per year'
  },
  cotton: {
    name: 'Cotton',
    season: 'Kharif season (April to June sowing)',
    water: 'Moderate (700-1100 mm) - Deep black cotton soils preferred',
    fertilizer: 'N: 100-120 kg/ha, P2O5: 50-60 kg/ha, K2O: 50-60 kg/ha'
  },
  jute: {
    name: 'Jute',
    season: 'Pre-kharif season (March to May sowing)',
    water: 'High (1200-1600 mm) - Warm humid climate with 70-90% humidity',
    fertilizer: 'N: 40-60 kg/ha, P2O5: 20-30 kg/ha, K2O: 30-40 kg/ha'
  },
  coffee: {
    name: 'Coffee',
    season: 'Monsoon planting (June to August)',
    water: 'High (1500-2200 mm) - Needs shade trees and rich organic mulch',
    fertilizer: 'N: 120-140 kg/ha, P2O5: 90-100 kg/ha, K2O: 120-140 kg/ha'
  }
};

export function predictCropLocal(input) {
  const normInput = {
    N: Number(input.nitrogen || input.N || 0),
    P: Number(input.phosphorus || input.P || 0),
    K: Number(input.potassium || input.K || 0),
    temperature: Number(input.temperature || 25),
    humidity: Number(input.humidity || 70),
    ph: Number(input.ph || 6.5),
    rainfall: Number(input.rainfall || 100)
  };

  const weights = { N: 1.0, P: 1.0, K: 1.2, temperature: 1.5, humidity: 1.5, ph: 1.2, rainfall: 1.8 };

  const distances = Object.entries(CROP_CENTROIDS).map(([cropKey, centroid]) => {
    let sum = 0;
    for (const key of Object.keys(weights)) {
      const diff = (normInput[key] - centroid[key]) / FEATURE_STDS[key];
      sum += weights[key] * (diff * diff);
    }
    return { cropKey, dist: Math.sqrt(sum) };
  });

  distances.sort((a, b) => a.dist - b.dist);
  const best = distances[0];
  const meta = CROP_METADATA[best.cropKey] || {
    name: best.cropKey.charAt(0).toUpperCase() + best.cropKey.slice(1),
    season: 'Optimal cropping season',
    water: 'Maintain regular field moisture',
    fertilizer: 'Apply balanced NPK'
  };

  const confidence = Math.max(82, Math.min(98.8, 100 - (best.dist * 3.2)));

  return {
    crop: meta.name,
    confidence_score: Number(confidence.toFixed(2)),
    short_description: `Based on your soil (N: ${normInput.N}, P: ${normInput.P}, K: ${normInput.K}, pH: ${normInput.ph}) and climate conditions, ${meta.name} is the optimal recommended crop.`,
    suitable_season: meta.season,
    water_requirement: meta.water,
    fertilizer_recommendation: meta.fertilizer
  };
}

export function getAgriChatResponseLocal(query, lang = 'en') {
  const q = (query || '').toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|namaskar|sat sri akal|pranam|halo|start)/i.test(q) && q.length < 25) {
    if (lang === 'hi') {
      return "नमस्ते! मैं एग्रीबॉट (AgriBot) हूँ, आपका कृषि AI सहायक 🌾। आज मैं आपकी फसलों, खाद, कीट नियंत्रण या सरकारी योजनाओं में क्या मदद कर सकता हूँ?";
    }
    if (lang === 'pa') {
      return "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਐਗਰੀਬੋਟ (AgriBot) ਹਾਂ, ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ AI ਸਹਾਇਕ 🌾। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਫ਼ਸਲ, ਖਾਦ, ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?";
    }
    return "Namaste! I am AgriBot, your personal agricultural AI assistant 🌾. How can I assist you with your crops, soil, pests, or farming schemes today?";
  }

  // Yellow leaves
  if (q.includes('yellow') || q.includes('पीली') || q.includes('ਪੀਲੇ') || q.includes('chlorosis') || q.includes('deficiency') || q.includes('पत्ते')) {
    if (lang === 'hi') {
      return `### 🌾 पत्तियों के पीले पड़ने का कारण और उपचार

1. **नाइट्रोजन (Nitrogen) की कमी:**
   - यदि निचली पत्तियां पहले पीली हो रही हैं।
   - **उपचार:** 10-15 ग्राम यूरिया प्रति लीटर पानी में मिलाकर स्प्रे करें या सिंचाई के साथ हल्की यूरिया दें।

2. **जिंक (Zinc) की कमी:**
   - यदि नई पत्तियों की नसों के बीच पीलापन है।
   - **उपचार:** 0.5% जिंक सल्फेट (5 ग्राम/लीटर) + 2.5 ग्राम बुझा हुआ चूना मिलाकर छिड़कें।

3. **जल भराव:** खेत से अतिरिक्त पानी तुरंत निकालें।`;
    }
    return `### 🌾 Causes of Yellowing Leaves & Treatment

1. **Nitrogen (N) Deficiency:**
   - **Symptom:** Lower (older) leaves turn pale yellow first.
   - **Remedy:** Foliar spray of 1-2% Urea (10-15 g per liter of water) or top-dressing with nitrogen during irrigation.

2. **Zinc or Iron Deficiency:**
   - **Symptom:** Younger leaves turn yellow while veins remain green (interveinal chlorosis).
   - **Remedy:** Spray Zinc Sulphate (0.5% = 5g/L) mixed with 2.5g slaked lime, or Chelated Iron spray.

3. **Poor Drainage:**
   - Ensure proper field drainage to allow roots to breathe.`;
  }

  // Pest control
  if (q.includes('pest') || q.includes('insect') || q.includes('borer') || q.includes('aphid') || q.includes('कीट') || q.includes('कीड़ा') || q.includes('ਸੁੰਡੀ') || q.includes('spray') || q.includes('neem')) {
    if (lang === 'hi') {
      return `### 🐛 कीट एवं सुंडी नियंत्रण के प्रभावी उपाय

1. **जैविक नियंत्रण (Organic Control):**
   - **नीम तेल (Neem Oil):** 10,000 PPM नीम तेल 3-5 मिली प्रति लीटर पानी में मिलाकर शाम को छिड़कें।
   - **येलो स्टिकी ट्रैप:** रस चूसक कीटों (माहू, सफेद मक्खी) के लिए प्रति एकड़ 6-8 ट्रैप लगाएं।

2. **सुंडी / तना छेदक (Stem Borer / Caterpillars):**
   - **रासायनिक उपाय:** कोराजन (Chlorantraniliprole 18.5% SC) 0.4 मिली/लीटर या इमामेक्टिन बेंजोएट 0.5 ग्राम/लीटर।

3. **सुझाव:** छिड़काव हमेशा सुबह या शाम के समय करें जब धूप कम हो।`;
    }
    return `### 🐛 Integrated Pest Management (IPM) & Crop Protection

1. **Eco-Friendly Bio-Controls:**
   - **Neem Oil Spray:** 10,000 PPM Neem Oil @ 3-5 ml per liter of water with mild soap solution.
   - **Sticky Traps:** 6-8 yellow/blue sticky traps per acre for whiteflies, aphids, and thrips.

2. **Targeted Remedies:**
   - **Sucking Pests (Aphids, Jassids, Whitefly):** Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.
   - **Caterpillars & Borers:** Chlorantraniliprole (Coragen) @ 0.4 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L.

3. **Application Tip:** Spray during early morning or late evening to protect pollinating bees.`;
  }

  // Fertilizer
  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('npk') || q.includes('खाद') || q.includes('ਖਾਦ') || q.includes('manure')) {
    if (lang === 'hi') {
      return `### 🧪 फसल के लिए संतुलित उर्वरक (Fertilizer Management)

1. **अनाज वाली फसलें (गेहूं, धान, मक्का):** N:P:K का आदर्श अनुपात **4:2:1** होता है।
2. **DAP / SSP:** हमेशा बुवाई के समय बेसल डोज के रूप में डालें।
3. **यूरिया:** 2-3 बराबर भागों में बांटकर पहली और दूसरी सिंचाई के बाद छिड़कें।
4. **जैविक खाद:** बुवाई से पहले 4-5 टन गोबर की सड़ी खाद या 2 टन केंचुआ खाद प्रति एकड़ अवश्य मिलाएं।`;
    }
    return `### 🧪 Balanced Fertilizer Application Guide

1. **Cereals (Paddy, Wheat, Maize):** Target standard 4:2:1 ratio (approx. 100-120 kg N, 50-60 kg P2O5, 40-50 kg K2O per hectare).
2. **Basal Dose (At Sowing):** Entire Phosphorus (DAP/SSP), Potash (MOP), and 1/3rd of Nitrogen.
3. **Top Dressing:** Remaining Nitrogen split across 2 equal applications at critical irrigation stages.
4. **Soil Health:** Add 4-5 tonnes of well-decomposed FYM or 2 tonnes of vermicompost per acre before sowing.`;
  }

  // Schemes
  if (q.includes('scheme') || q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('kcc') || q.includes('loan') || q.includes('subsidy') || q.includes('योजना') || q.includes('insurance')) {
    if (lang === 'hi') {
      return `### 🏛️ प्रमुख सरकारी किसान योजनाएं एवं लाभ

1. **पीएम किसान सम्मान निधि (PM-KISAN):**
   - पात्र किसानों को सालाना **₹6,000** की सहायता (₹2,000 की 3 किस्तों में)। पोर्टल: [pmkisan.gov.in](https://pmkisan.gov.in)।
2. **किसान क्रेडिट कार्ड (KCC):**
   - ₹3 लाख तक का ऋण मात्र **4% ब्याज दर** पर (समय पर भुगतान पर)।
3. **प्रधानमंत्री फसल बीमा योजना (PMFBY):**
   - प्राकृतिक आपदाओं पर फसल बीमा (खरीफ 2%, रबी 1.5% प्रीमियम)।
4. **पीएम कुसुम योजना (Solar Pump):**
   - सोलर पंप लगाने पर केंद्र व राज्य सरकार से 60% तक सब्सिडी।`;
    }
    return `### 🏛️ Key Government Agricultural Schemes & Subsidies

1. **PM-KISAN:**
   - Direct income support of **₹6,000 per year** in 3 equal installments of ₹2,000. Portal: [pmkisan.gov.in](https://pmkisan.gov.in).
2. **Kisan Credit Card (KCC):**
   - Concessional short-term crop loans up to ₹3,00,000 at an effective **4% interest rate** upon timely repayment.
3. **PM Fasal Bima Yojana (PMFBY):**
   - Subsidized crop insurance against drought, floods, and unseasonal rains (2% Kharif, 1.5% Rabi premium).
4. **PM-KUSUM Scheme:**
   - Up to 60% capital subsidy on off-grid solar irrigation pumps.`;
  }

  // General agricultural advisory
  if (lang === 'hi') {
    return `### 🌾 एग्रीबॉट कृषि परामर्श (AgriBot Advisory)

आपके प्रश्न "${query}" के संबंध में मुख्य कृषि सुझाव:

1. **मृदा परीक्षण:** किसी भी फसल या उर्वरक के प्रयोग से पहले मृदा स्वास्थ्य कार्ड (Soil Health Card) के अनुसार ही N-P-K का उपयोग करें।
2. **कीट प्रबंधन:** कीटों या रोगों की प्रारंभिक अवस्था में ही नीम तेल या अनुशंसित जैविक उपायों का प्रयोग करें।
3. **जल दक्षता:** ड्रिप या स्प्रिंकलर सिंचाई अपनाएं जिससे 50-70% पानी की बचत होती है।
4. **मौसम पूर्वानुमान:** बुवाई और छिड़काव से पहले आगामी 5 दिनों का मौसम पूर्वानुमान अवश्य देखें।

आप किसी भी विशिष्ट फसल (जैसे गेहूं, धान, कपास) या बीमारी के बारे में प्रश्न पूछ सकते हैं!`;
  }

  return `### 🌾 AgriBot Advisory & Farmer Support

Regarding your query: **"${query}"**

1. **Soil & Nutrients:** Always apply fertilizers (Urea, DAP, MOP) based on a recent Soil Health Card test to save costs and avoid soil salinity.
2. **Pest Control:** Inspect crops twice weekly. Use Neem-based bio-pesticides or pheromone traps at the first sign of pest infestation.
3. **Water Management:** Adopt micro-irrigation (Drip/Sprinkler) to conserve water and improve nutrient uptake through fertigation.
4. **Weather Planning:** Check the **Weather Forecast** module on AgriConnect before scheduling foliar spraying or harvesting.

Feel free to ask specific questions about any crop (*Rice, Wheat, Cotton, Maize, Tomato*), pest control, fertilizer calculation, or government subsidies!`;
}
