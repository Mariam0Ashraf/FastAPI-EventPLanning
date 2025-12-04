from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from core.jwt_handler import SECRET_KEY, ALGORITHM
from services.user_service import getUserByIdService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await getUserByIdService(user_id)
        return {"user_id": user_id, "user_email": user.email}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
