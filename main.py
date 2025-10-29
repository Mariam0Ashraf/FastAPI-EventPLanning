from fastapi import FastAPI
from db import checkConnection

app = FastAPI()

@app.get("/")
async def home():
    connected = await checkConnection()
    if connected:
        return {"MongoDB connected successfully"}
    else:
        return {"MongoDB connection failed"}
