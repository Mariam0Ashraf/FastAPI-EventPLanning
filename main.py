from fastapi import FastAPI
from core.config import checkConnection
from routes import auth_routes

app = FastAPI()
app.include_router(auth_routes.router)

@app.get("/")
async def home():
    connected = await checkConnection()
    if connected:
        return {"MongoDB connected successfully"}
    else:
        return {"MongoDB connection failed"}
