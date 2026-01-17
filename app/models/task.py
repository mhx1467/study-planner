from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base
import enum
from datetime import datetime

class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    priority = Column(String)
    deadline = Column(DateTime)
    estimated_minutes = Column(Integer)
    actual_minutes = Column(Integer, nullable=True)
    status = Column(Enum(TaskStatus))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    completed_at = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    subject = relationship("Subject")
