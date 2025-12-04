from fastapi import APIRouter, HTTPException
from requests.user_requests import UserRegisterRequest, UserLoginRequest
from services.user_service import registerUser, loginUser, getUserByIdService

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

    return newUser


@router.post("/login")
async def login(request: UserLoginRequest):
    logged_user = await loginUser(email=request.email, password=request.password)

    if "error" in logged_user:
        raise HTTPException(status_code=logged_user["code"], detail=logged_user["error"])

    return logged_user

@router.get("/{user_id}")

async def get_user_by_id(user_id: str):
    user = await getUserByIdService(user_id)

    if "error" in user:
        raise HTTPException(status_code=user["code"], detail=user["error"])

    return user
