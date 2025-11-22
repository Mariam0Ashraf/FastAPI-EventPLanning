from fastapi import APIRouter, Depends
from core.deps import get_current_user

router = APIRouter(prefix="/protected", tags=["Protected"])


@router.get("/authorized")
async def authorized_route(current_user: dict = Depends(get_current_user)):
    return {"message": "You are authorized", "user_id": current_user["user_id"]}
