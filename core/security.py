from passlib.context import CryptContext

pwdContext = CryptContext(schemes=["argon2"], deprecated="auto")

def hashPassword(password: str) -> str:
    return pwdContext.hash(password)

