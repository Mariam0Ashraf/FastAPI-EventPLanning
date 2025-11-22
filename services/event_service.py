from repositories.event_repository import createEvent, findEventsByUser, deleteEventById, addUserToEvent, findEventById, \
    findEventsInvitedTo
from repositories.user_repository import findUserByEmail


async def createEventService(eventData: dict):
    newEvent = await createEvent(eventData)
    return newEvent

async def getUserEventsService(user_id: str):
    events = await findEventsByUser(user_id)
    return events

async def deleteEventService(event_id: str, user_id: str):
    deleted = await deleteEventById(event_id, user_id)

    if deleted == 0:
        return {"error": "Event not found or you do not have permission", "code": 404}

    return {"message": "Event deleted successfully"}


async def inviteUserToEvent(event_id: str, inviter_id: str, email: str):
    event = await findEventById(event_id)

    if not event:
        return {"error": "Event not found", "code": 404}

    if event["created_by"] != inviter_id:
        return {"error": "You are not the owner of this event", "code": 403}

    invited_user = await findUserByEmail(email)

    if not invited_user:
        return {"error": "User with this email does not exist", "code": 404}

    updated = await addUserToEvent(event_id, invited_user.id)

    if updated == 0:
        return {"error": "User already invited or event not found", "code": 400}

    return {"message": "User invited successfully"}

async def getInvitedEventsService(user_id: str):
    return await findEventsInvitedTo(user_id)
