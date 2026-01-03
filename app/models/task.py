from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from app.database.base import Base
import enum

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
    status = Column(Enum(TaskStatus))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
