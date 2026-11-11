import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255))
    completed: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    important: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
    userId: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    createdAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updatedAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="todos")
