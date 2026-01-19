from fastapi import APIRouter, Depends
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.services.stats import (
    get_user_statistics,
    get_weekly_progress,
    get_subject_breakdown,
    completion_percentage
)
from app.models.subject import Subject
from app.models.task import Task

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("/")
def get_statistics(user=Depends(get_current_user), db=Depends(get_db)):
    return get_user_statistics(db, user.id)

@router.get("/weekly")
def get_weekly_stats(user=Depends(get_current_user), db=Depends(get_db)):
    return get_weekly_progress(db, user.id)

@router.get("/subjects")
def get_subject_stats(user=Depends(get_current_user), db=Depends(get_db)):
    return get_subject_breakdown(db, user.id)

@router.get("/completion")
def completion(user=Depends(get_current_user), db=Depends(get_db)):
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user.id).all()
    return {"completion_percent": completion_percentage(tasks)}
