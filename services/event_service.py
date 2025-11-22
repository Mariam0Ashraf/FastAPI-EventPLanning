from bson import ObjectId

from repositories.event_repository import createEvent, findEventsByUser, deleteEventById, addUserToEvent, findEventById, \
    findEventsInvitedTo, updateEvent
from repositories.user_repository import findUserByEmail, usersCollection


async def createEventService(eventData: dict):
    newEvent = await createEvent(eventData)
    return newEvent

async def getUserEventsService(user_id: str):
    events = await findEventsByUser(user_id)
    return [getEventWithRole(event, user_id) for event in events]


async def deleteEventService(event_id: str, user_id: str):
    deleted = await deleteEventById(event_id, user_id)

    if deleted == 0:
        return {"error": "Event not found or you do not have permission", "code": 404}

    return {"message": "Event deleted successfully"}


async def inviteUserToEvent(event_id: str, inviter_id: str, email: str):
    event = await findEventById(event_id)

    if not event:
        return {"error": "Event not found", "code": 404}

    if not isOrganizer(event, inviter_id):
        return {"error": "You are not allowed to invite collaborators", "code": 403}

    invited_user = await findUserByEmail(email)

    if not invited_user:
        return {"error": "User with this email does not exist", "code": 404}

    updated = await addUserToEvent(event_id, invited_user.id)

    if updated == 0:
        return {"error": "User already invited or event not found", "code": 400}

    return {"message": "User invited successfully"}

async def getInvitedEventsService(user_id: str):
    events = await findEventsInvitedTo(user_id)
    return [getEventWithRole(event, user_id) for event in events]


def getEventWithRole(event, user_id):
    role = "organizer" if event.created_by == user_id else "attendee"
    return {
        "id": event.id,
        "title": event.title,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "description": event.description,
        "created_by": event.created_by,
        "invited_users": event.invited_users,
        "role": role
    }


async def inviteCollaborator(event_id: str, inviter_id: str, email: str):
    event = await findEventById(event_id)
    if not event:
        return {"error": "Event not found", "code": 404}
    if not isOrganizer(event, inviter_id):
        return {"error": "You are not allowed to invite collaborators", "code": 403}

    invited_user = await findUserByEmail(email)

    if not invited_user:
        return {"error": "User with this email not found", "code": 404}
    invited_user_id = str(invited_user.id)

    if invited_user_id in event.collaborators:
        return {"error": "User already a collaborator", "code": 400}
    event.collaborators.append(invited_user_id)

    updatedEvent = await updateEvent(event_id, {"collaborators": event.collaborators})

    return {"message": "Collaborator added", "event": updatedEvent}

def isOrganizer(event, user_id: str):
    return (
        event.created_by == user_id or
        user_id in event.collaborators
    )