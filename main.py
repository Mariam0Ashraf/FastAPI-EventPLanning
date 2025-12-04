from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import checkConnection
from routes import auth_routes
from routes import protected_routes
from routes import event_routes

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

app.include_router(protected_routes.router)
app.include_router(event_routes.router)
