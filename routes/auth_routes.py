from fastapi import APIRouter, HTTPException
from requests.user_requests import UserRegisterRequest
from services.user_service import registerUser

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(request: UserRegisterRequest):
    newUser = await registerUser(
        username=request.username,
        email=request.email,
        password=request.password
    )

    if "error" in newUser:
        raise HTTPException(status_code=400, detail=newUser["error"])

    newUser["_id"] = str(newUser["_id"])
    return {"id": newUser["_id"], "username": newUser["username"], "email": newUser["email"]}
