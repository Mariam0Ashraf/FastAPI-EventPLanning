from passlib.context import CryptContext

pwdContext = CryptContext(schemes=["argon2"], deprecated="auto")


def hashPassword(password: str) -> str:
    return pwdContext.hash(password)


def checkPassword(password: str, hashed_password) -> bool:
    return pwdContext.verify(password, hashed_password)
