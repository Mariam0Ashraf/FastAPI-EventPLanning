from bson import ObjectId

from repositories.event_repository import createEvent, findEventsByUser, deleteEventById, addUserToEvent, findEventById, \
    findEventsInvitedTo, updateEvent, eventsCollection
from repositories.user_repository import findUserByEmail, usersCollection
from requests.event_requests import InvitationStatus


async def createEventService(eventData: dict):
    newEvent = await createEvent(eventData)
    return newEvent

async def getUserEventsService(user_email: str):
    events = await findEventsByUser(user_email)
    return [getEventWithRole(event, user_email) for event in events]


async def deleteEventService(event_id: str, user_email: str):
    deleted = await deleteEventById(event_id, user_email)

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

async def getInvitedEventsService(user_email: str):
    events = await findEventsInvitedTo(user_email)
    return [getEventWithRole(event, user_email) for event in events]


def getEventWithRole(event, user_email):
    role = "organizer" if event.created_by == user_email else "attendee"
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


async def updateUserEventStatus(event_id: str, user_email: str, new_status: InvitationStatus) -> bool:
    """
    Updates the RSVP status of a specific user in a specific event.
    Returns True if the user was found and the operation ran, False otherwise.
    """

    # 1. The Filter Query
    # We need to find the Event AND the specific user inside the array.
    filter_query = {
        "_id": ObjectId(event_id),
        "invited_users.user_email": user_email
    }

    # 2. The Update Query
    # The '$' acts as a placeholder for the index of the user found in the filter_query.
    # It says: "Update the status of the item you just found in the array"
    update_query = {
        "$set": {
            "invited_users.$.status": new_status
        }
    }

    # 3. Execute
    result = await eventsCollection.update_one(filter_query, update_query)

    # 4. Return Status
    # matched_count > 0 means the event and user exist.
    # We check matched_count instead of modified_count because if the user
    # sends "accepted" when it's already "accepted", modified will be 0,
    # but the operation was essentially successful.
    return result.matched_count > 0
