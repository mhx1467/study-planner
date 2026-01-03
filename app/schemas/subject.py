from pydantic import BaseModel, Field
from typing import Optional

class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class SubjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)

class SubjectOut(SubjectCreate):
    id: int

    class Config:
        orm_mode = True

class SubjectWithStats(SubjectOut):
    task_count: int = 0
    completed_tasks: int = 0
