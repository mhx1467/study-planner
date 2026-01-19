from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.models.task import Task
from app.models.subject import Subject
from app.schemas.schedule import ScheduleCreate, ScheduleOut, ScheduleUpdate
from app.services import schedule as schedule_service

router = APIRouter(prefix="/schedule", tags=["Schedule"])

@router.post("/", response_model=ScheduleOut)
def create_schedule(schedule: ScheduleCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return schedule_service.create_schedule(db, user.id, schedule.model_dump())

@router.get("/", response_model=list[ScheduleOut])
def list_schedules(
    start_date: datetime | None = Query(None),
    end_date: datetime | None = Query(None),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return schedule_service.list_user_schedules(db, user.id, start_date, end_date)

@router.get("/{schedule_id}", response_model=ScheduleOut)
def get_schedule(schedule_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return schedule_service.get_schedule_by_id(db, schedule_id, user.id)

@router.put("/{schedule_id}", response_model=ScheduleOut)
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return schedule_service.update_schedule(db, schedule_id, user.id, schedule_update.model_dump(exclude_unset=True))

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return schedule_service.delete_schedule(db, schedule_id, user.id)

@router.post("/generate")
def generate_schedule(
    user=Depends(get_current_user), 
    db: Session = Depends(get_db),
    end_date: datetime | None = Query(None),
    short_break_minutes: int = Query(5),
    medium_break_minutes: int = Query(15),
    long_break_minutes: int = Query(30),
    long_break_after_minutes: int = Query(90),
):
    from app.services.scheduler import generate_schedule_from_tasks
    
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user.id).all()
    if not tasks:
        raise HTTPException(400, "No tasks found to schedule")
    
    schedule_service.clear_user_schedules(db, user.id)
    
    schedule_entries = generate_schedule_from_tasks(
        tasks, 
        user.id,
        end_date=end_date,
        short_break_minutes=short_break_minutes,
        medium_break_minutes=medium_break_minutes,
        long_break_minutes=long_break_minutes,
        long_break_after_minutes=long_break_after_minutes,
    )
    
    schedule_service.create_schedules_from_tasks(db, user.id, schedule_entries)
    return {"message": "Schedule generated successfully", "entries_created": len(schedule_entries)}
