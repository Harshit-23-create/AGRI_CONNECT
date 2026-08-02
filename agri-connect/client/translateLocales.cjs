const fs = require('fs');
const path = require('path');
const https = require('https');

const localesDir = path.join(__dirname, 'public', 'locales');
const enDir = path.join(localesDir, 'en');

const langs = ['pa', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'or']; // hi is partially done, but let's re-do it or skip. Let's do all.
const allLangs = ['hi', 'pa', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'or'];

async function translateText(text, targetLang) {
  // Using a free translation API or just pseudo translation if it fails
  return new Promise((resolve) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let translated = '';
          if (json && json[0]) {
            json[0].forEach(item => {
              if (item[0]) translated += item[0];
            });
          }
          resolve(translated || text);
        } catch (e) {
          resolve(text); // fallback
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function translateObject(obj, targetLang) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      result[key] = await translateText(obj[key], targetLang);
    } else if (typeof obj[key] === 'object') {
      result[key] = await translateObject(obj[key], targetLang);
    }
  }
  return result;
}

async function run() {
  const files = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  for (const lang of allLangs) {
    const langDir = path.join(localesDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    for (const file of files) {
      console.log(`Translating ${file} to ${lang}...`);
      const enData = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));
      
      const translatedData = await translateObject(enData, lang);
      fs.writeFileSync(path.join(langDir, file), JSON.stringify(translatedData, null, 2));
      
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log('Translation complete!');
}

run();
