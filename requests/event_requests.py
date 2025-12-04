import datetime

from pydantic import BaseModel, Field
from enum import Enum


class CreateEventRequest(BaseModel):
    title: str
    date: datetime.date
    time: str
    location: str
    description: str


class InvitationStatus(str, Enum):
    PENDING = "pending"
    GOING = "going"
    NOT_GOING = "not_going"
    MAYBE = "maybe"


class InvitedUser(BaseModel):
    email: str
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


class SearchEventRequest(BaseModel):
    q: str | None = Field(
        default=None,
        description="Search term for title or description"
    )

    # 2. Date Filters
    start_date: datetime.date | None = Field(
        default=None,
        description="Filter events after this date (YYYY-MM-DD)"
    )

    end_date: datetime.date | None = Field(
        default=None,
        description="Filter events before this date (YYYY-MM-DD)"
    )

    # 3. Enum Filter
    status: InvitationStatus | None = Field(
        default=None,
        description="Filter by your attendance status"
    )

