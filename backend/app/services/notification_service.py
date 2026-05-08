"""
Notification Service — CRUD operations for notifications.
"""
import uuid
from typing import Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


async def create_notification(
    db: AsyncSession,
    user_id: uuid.UUID,
    title: str,
    message: str,
) -> Notification:
    """Create a new notification."""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        is_read=False,
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def get_user_notifications(
    db: AsyncSession,
    user_id: uuid.UUID,
    unread_only: bool = False,
) -> list[Notification]:
    """Get notifications for a user."""
    query = select(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    query = query.order_by(Notification.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def mark_as_read(db: AsyncSession, notification_id: uuid.UUID) -> Optional[Notification]:
    """Mark a single notification as read."""
    result = await db.execute(
        select(Notification).filter(Notification.id == notification_id)
    )
    notification = result.scalars().first()
    if notification:
        notification.is_read = True
        await db.commit()
        await db.refresh(notification)
    return notification


async def mark_all_read(db: AsyncSession, user_id: uuid.UUID) -> int:
    """Mark all notifications as read for a user. Returns count updated."""
    result = await db.execute(
        update(Notification)
        .where(Notification.user_id == user_id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.commit()
    return result.rowcount
