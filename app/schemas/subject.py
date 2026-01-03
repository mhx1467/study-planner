from pydantic import BaseModel

class SubjectCreate(BaseModel):
    name: str
    description: str | None = None

class SubjectOut(SubjectCreate):
    id: int

    class Config:
        orm_mode = True
