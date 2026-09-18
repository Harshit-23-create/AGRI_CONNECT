# AgriConnect - Smart Agriculture Platform

AgriConnect is a comprehensive smart agriculture platform designed to empower farmers with modern technology. It consists of a user-friendly frontend client, a robust Node.js backend, and a Machine Learning service for advanced agricultural predictions and insights.

## Project Structure

The codebase is located within the `agri-connect` directory, which is organized into three main services:

- **`client/`**: The frontend application built with React and Vite. It provides a responsive and accessible user interface for farmers, including internationalization support.
- **`server/`**: The backend API built with Node.js, Express, and MongoDB. It handles user authentication, data management, and integrates with AI features (Google GenAI).
- **`ml-service/`**: A FastAPI-based Python service that provides machine learning capabilities, such as crop recommendations or disease detection.

## Tech Stack

### Frontend (Client)
- **Framework:** React 19, Vite
- **Routing:** React Router DOM
- **Internationalization:** i18next, react-i18next
- **HTTP Client:** Axios
- **UI Notifications:** React Hot Toast

### Backend (Server)
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Security:** Helmet, Express Rate Limit, CORS
- **AI Integration:** Google GenAI SDK

### Machine Learning Service (ML-Service)
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Python 3.8+
- MongoDB instance (local or MongoDB Atlas)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd agri-connect
   ```

2. **Install Root Dependencies:**
   The root directory contains a manager (`concurrently`) to run all services at once.
   ```bash
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Install Server Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

5. **Install ML Service Dependencies:**
   ```bash
   cd ../ml-service
   # It's recommended to create a virtual environment first
   # python -m venv venv
   # source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)
   pip install -r requirements.txt
   ```

### Environment Variables
You will need to set up environment variables for each service. Please review the `ENV_VARS.md` file in the `agri-connect` directory and configure `.env` files for the services with variables like your MongoDB connection string, JWT secrets, and API keys.

### Running the Application

You can start all services concurrently from the `agri-connect` directory:

```bash
cd agri-connect
npm start
```

This command will simultaneously start:
- The React client in development mode
- The Express server
- The FastAPI ML service (on `http://localhost:8000`)

Alternatively, you can run each service individually by navigating to their respective directories and using their specific start commands (e.g., `npm run dev` in `client`, `npm start` in `server`).

## Features
- **Multilingual Support:** Built-in i18n capabilities to support users in different languages.
- **AI-Powered Insights:** Leverages Google GenAI for smart agricultural advice.
- **ML Predictions:** Dedicated machine learning microservice for data-driven farming decisions.
- **Secure Authentication:** Robust user management and secure API endpoints.