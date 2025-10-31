from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import checkConnection
from routes import auth_routes

app = FastAPI()

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
@app.get("/")
async def home():
    connected = await checkConnection()
    if connected:
        return {"MongoDB connected successfully"}
    else:
        return {"MongoDB connection failed"}
