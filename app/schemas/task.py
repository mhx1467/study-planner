from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str
    priority: str
    deadline: datetime
    estimated_minutes: int
    subject_id: int

class TaskUpdate(TaskCreate):
    status: str

class TaskOut(TaskCreate):
    id: int
    status: str

    class Config:
        orm_mode = True
