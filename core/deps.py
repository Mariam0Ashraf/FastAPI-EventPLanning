from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from core.jwt_handler import SECRET_KEY, ALGORITHM
from repositories.user_repository import findUserById

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        user = await findUserById(user_id)

        if user_id is None or user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"user_id": user_id, "user_email": user.email}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
