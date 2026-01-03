from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.models.schedule import Schedule
from app.models.subject import Subject
from app.models.task import Task
from app.schemas.schedule import ScheduleCreate, ScheduleOut, ScheduleUpdate

router = APIRouter(prefix="/schedule", tags=["Schedule"])

@router.post("/", response_model=ScheduleOut)
def create_schedule(schedule: ScheduleCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new schedule entry"""
    # Verify subject belongs to user if provided
    if schedule.subject_id:
        subject = db.query(Subject).filter(Subject.id == schedule.subject_id, Subject.user_id == user.id).first()
        if not subject:
            raise HTTPException(403, "Subject not found or access denied")
    
    # Verify task belongs to user if provided
    if schedule.task_id:
        task = db.query(Task).join(Subject).filter(Task.id == schedule.task_id, Subject.user_id == user.id).first()
        if not task:
            raise HTTPException(403, "Task not found or access denied")
    
    db_schedule = Schedule(
        **schedule.model_dump(),
        user_id=user.id
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.get("/", response_model=list[ScheduleOut])
def list_schedules(
    start_date: datetime = None,
    end_date: datetime = None,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all schedule entries for the user, optionally filtered by date range"""
    query = db.query(Schedule).filter(Schedule.user_id == user.id)
    
    if start_date:
        query = query.filter(Schedule.start_time >= start_date)
    if end_date:
        query = query.filter(Schedule.end_time <= end_date)
    
    return query.order_by(Schedule.start_time).all()

@router.get("/{schedule_id}", response_model=ScheduleOut)
def get_schedule(schedule_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific schedule entry"""
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == user.id).first()
    if not schedule:
        raise HTTPException(404, "Schedule entry not found")
    return schedule

@router.put("/{schedule_id}", response_model=ScheduleOut)
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a schedule entry"""
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == user.id).first()
    if not db_schedule:
        raise HTTPException(404, "Schedule entry not found")
    
    for key, value in schedule_update.model_dump(exclude_unset=True).items():
        setattr(db_schedule, key, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a schedule entry"""
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id, Schedule.user_id == user.id).first()
    if not schedule:
        raise HTTPException(404, "Schedule entry not found")
    
    db.delete(schedule)
    db.commit()
    return {"ok": True}

@router.post("/generate")
def generate_schedule(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Generate AI-powered schedule based on user's tasks"""
    from app.services.ai_scheduler import generate_schedule_from_tasks
    
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user.id).all()
    if not tasks:
        raise HTTPException(400, "No tasks found to schedule")
    
    # Generate schedule entries
    schedule_entries = generate_schedule_from_tasks(tasks, user.id)
    
    # Save generated schedules
    for entry in schedule_entries:
        db_schedule = Schedule(**entry)
        db.add(db_schedule)
    
    db.commit()
    return {"message": "Schedule generated successfully", "entries_created": len(schedule_entries)}
