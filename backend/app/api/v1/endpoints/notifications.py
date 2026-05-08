"""
Notification endpoints.
"""
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationRead
from app.services import notification_service

router = APIRouter()


@router.get("/", response_model=list[NotificationRead])
async def list_notifications(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all notifications for the current user."""
    return await notification_service.get_user_notifications(
        db, current_user.id, unread_only
    )


@router.put("/{notification_id}/read", response_model=NotificationRead)
async def mark_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a single notification as read."""
    notification = await notification_service.mark_as_read(db, notification_id)
    if not notification:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@router.put("/read-all")
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all notifications as read for the current user."""
    count = await notification_service.mark_all_read(db, current_user.id)
    return {"message": f"Marked {count} notifications as read", "count": count}
