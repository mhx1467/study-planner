from fastapi import APIRouter
from app.services.stats import completion_percentage
from app.database.session import SessionLocal
from app.models.task import Task

router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.get("/completion")
def completion():
    db = SessionLocal()
    tasks = db.query(Task).all()
    return {"completion_percent": completion_percentage(tasks)}
