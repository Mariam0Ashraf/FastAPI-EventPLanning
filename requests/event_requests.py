from pydantic import BaseModel
from enum import Enum


class CreateEventRequest(BaseModel):
    title: str
    date: str
    time: str
    location: str
    description: str


class InvitationStatus(str, Enum):
    PENDING = "pending"
    GOING = "going"
    NOT_GOING = "not_going"
    MAYBE = "maybe"


class InvitedUser(BaseModel):
    user_id: str
    status: InvitationStatus = InvitationStatus.PENDING


class InviteUserRequest(BaseModel):
    event_id: str
    email: str


class InviteCollaboratorRequest(BaseModel):
    event_id: str
    email: str


class UpdateEventAttendance(BaseModel):
    event_id: str
    status: str
