Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml-service; uvicorn main:app --reload"
