from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional
from bson import ObjectId
from typing_extensions import Annotated  # Use this for broad compatibility


# You can DELETE the PyObjectId class.

class User(BaseModel):
    # This is the new, clean way to handle the _id field
    # It validates the ObjectId by first converting it to a string.
    id: Optional[Annotated[str, BeforeValidator(str)]] = Field(
        alias="_id", default=None
    )

    # 2. Core User Fields
    username: str
    email: str
    password: str  # This should be the hashed password

    class Config:
        # A. Allows Pydantic to read data using the field alias (e.g., '_id' -> 'id')
        populate_by_name = True

        # B. We still need this for serializing any other ObjectIds
        #    that might not be handled by the 'Annotated' type above.
        json_encoders = {
            ObjectId: str
        }