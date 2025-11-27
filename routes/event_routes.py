from fastapi import APIRouter, Depends
from core.deps import get_current_user
from requests.event_requests import CreateEventRequest, InviteUserRequest, InviteCollaboratorRequest, \
    UpdateEventAttendance
from services.event_service import createEventService, getUserEventsService, deleteEventService, inviteUserToEvent, \
    getInvitedEventsService, inviteCollaborator, updateUserEventStatus

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/create")
async def create_event(
    request: CreateEventRequest,
    current_user: dict = Depends(get_current_user)
):
    eventData = {
        "title": request.title,
        "date": request.date,
        "time": request.time,
        "location": request.location,
        "description": request.description,
        "created_by": current_user["user_id"],   # IMPORTANT
    }

    new_event = await createEventService(eventData)
    return {"message": "Event created successfully", "event": new_event}


@router.get("/my-events")
async def get_my_events(current_user: dict = Depends(get_current_user)):
    events = await getUserEventsService(current_user["user_id"])
    return {"events": events}

@router.delete("/delete/{event_id}")
async def delete_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await deleteEventService(event_id, current_user["user_id"])

    if "error" in result:
        return result

    return result

@router.post("/invite-attendee")
async def invite_user(
    request: InviteUserRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await inviteUserToEvent(
        event_id=request.event_id,
        inviter_id=current_user["user_id"],
        email=request.email
    )

    if "error" in result:
        return result

    return result

@router.get("/invited-to")
async def invited_events(current_user: dict = Depends(get_current_user)):
    events = await getInvitedEventsService(current_user["user_id"])
    return {"invited_events": events}

@router.post("/invite-collaborator")
async def invite_collaborator(
    request: InviteCollaboratorRequest,
    current_user: dict = Depends(get_current_user)
):
    result = await inviteCollaborator(
        event_id=request.event_id,
        inviter_id=current_user["user_id"],
        email=request.email
    )

    if "error" in result:
        return {"error": result["error"]}

    return result


@router.post("/event-attendance")
async def set_event_attendance(
        request: UpdateEventAttendance,
        current_user: dict = Depends(get_current_user)
):
    result = await updateUserEventStatus(
        event_id=request.event_id,
        user_id=current_user["user_id"],
        new_status=request.status
    )

    return {"message": "Attendance status updated successfully"} if result else {"error": "Unable to update the "
                                                                                          "attendance status"}
