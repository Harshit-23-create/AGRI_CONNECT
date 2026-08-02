# AgriConnect – Environment Variables

## Frontend (Vercel)
Copy this to Vercel → Project → Settings → Environment Variables

| Key | Value |
|-----|-------|
| VITE_API_URL | https://agri-connect-server.onrender.com/api |

---

## Backend (Render)
Copy these to Render → agri-connect-server → Environment

| Key | Value |
|-----|-------|
| MONGO_URI | (your MongoDB Atlas connection string) |
| JWT_SECRET | agriconnect_super_secret_jwt_key_2024 |
| GEMINI_API_KEY | (your Gemini API key) |
| OPENWEATHER_API_KEY | beee724417f4623efe66567e4e815c89 |
| CLIENT_URL | https://agri-connect-xxxxxx.vercel.app |
| FASTAPI_URL | https://agri-connect-ml.onrender.com/predict |
| FASTAPI_BASE_URL | https://agri-connect-ml.onrender.com |
| PORT | 5000 |

---

## ML Service (Render)
No extra env vars needed beyond PORT (auto-injected by Render).
