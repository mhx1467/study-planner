from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    priority: TaskPriority = TaskPriority.MEDIUM
    deadline: datetime
    estimated_minutes: int = Field(..., ge=15, le=480)
    subject_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Optional[TaskPriority] = None
    deadline: Optional[datetime] = None
    estimated_minutes: Optional[int] = Field(None, ge=15, le=480)
    actual_minutes: Optional[int] = Field(None, ge=15, le=1440)
    status: Optional[TaskStatus] = None

class TaskOut(TaskCreate):
    id: int
    status: TaskStatus
    actual_minutes: Optional[int] = None
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class TaskWithSubject(TaskOut):
    subject_name: Optional[str] = None

class TaskComplete(BaseModel):
    actual_minutes: int = Field(..., ge=15, le=1440)

