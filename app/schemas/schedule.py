from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ScheduleCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    task_id: Optional[int] = None
    subject_id: Optional[int] = None
    color: str = "blue"

class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    color: Optional[str] = None

class ScheduleOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    task_id: Optional[int]
    subject_id: Optional[int]
    color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
