from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.schedule import Schedule
from app.models.subject import Subject
from app.models.task import Task


def create_schedule(db: Session, user_id: int, schedule_data: dict):
    if schedule_data.get('subject_id'):
        subject = db.query(Subject).filter(
            Subject.id == schedule_data['subject_id'],
            Subject.user_id == user_id
        ).first()
        if not subject:
            raise HTTPException(status_code=403, detail="Subject not found or access denied")
    
    if schedule_data.get('task_id'):
        task = db.query(Task).join(Subject).filter(
            Task.id == schedule_data['task_id'],
            Subject.user_id == user_id
        ).first()
        if not task:
            raise HTTPException(status_code=403, detail="Task not found or access denied")
    
    db_schedule = Schedule(**schedule_data, user_id=user_id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def list_user_schedules(db: Session, user_id: int, start_date: datetime = None, end_date: datetime = None):
    query = db.query(Schedule).filter(Schedule.user_id == user_id)
    
    if start_date:
        query = query.filter(Schedule.start_time >= start_date)
    if end_date:
        query = query.filter(Schedule.end_time <= end_date)
    
    return query.order_by(Schedule.start_time).all()


def get_schedule_by_id(db: Session, schedule_id: int, user_id: int):
    schedule = db.query(Schedule).filter(
        Schedule.id == schedule_id,
        Schedule.user_id == user_id
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    return schedule


def update_schedule(db: Session, schedule_id: int, user_id: int, update_data: dict):
    db_schedule = get_schedule_by_id(db, schedule_id, user_id)
    
    update_dict = {k: v for k, v in update_data.items() if v is not None}
    
    for key, value in update_dict.items():
        setattr(db_schedule, key, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def delete_schedule(db: Session, schedule_id: int, user_id: int):
    schedule = get_schedule_by_id(db, schedule_id, user_id)
    db.delete(schedule)
    db.commit()
    return {"ok": True}


def clear_user_schedules(db: Session, user_id: int):
    db.query(Schedule).filter(Schedule.user_id == user_id).delete()
    db.commit()


def create_schedules_from_tasks(db: Session, user_id: int, schedule_entries: list):
    for entry in schedule_entries:
        db_schedule = Schedule(**entry)
        db.add(db_schedule)
    db.commit()
