from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.subject import Subject
from app.models.task import Task, TaskStatus


def create_task(db: Session, user_id: int, task_data: dict):
    subject = db.query(Subject).filter(
        Subject.id == task_data.get('subject_id'),
        Subject.user_id == user_id
    ).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Subject not found or access denied")
    
    db_task = Task(**task_data, status="todo")
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def list_user_tasks(db: Session, user_id: int, status: str = None):
    query = db.query(Task).join(Subject).filter(Subject.user_id == user_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    tasks = query.order_by(Task.deadline).all()
    
    result = []
    for task in tasks:
        task_dict = format_task_response(task)
        result.append(task_dict)
    
    return result


def get_task_by_id(db: Session, task_id: int, user_id: int):
    task = db.query(Task).join(Subject).filter(
        Task.id == task_id,
        Subject.user_id == user_id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def update_task(db: Session, task_id: int, user_id: int, update_data: dict):
    db_task = get_task_by_id(db, task_id, user_id)
    
    update_dict = {k: v for k, v in update_data.items() if v is not None}
    
    if 'status' in update_dict:
        if update_dict['status'] == 'done' and db_task.status != 'done':
            db_task.completed_at = datetime.utcnow()
        elif update_dict['status'] != 'done' and db_task.status == 'done':
            db_task.completed_at = None
    
    for key, value in update_dict.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task


def complete_task(db: Session, task_id: int, user_id: int, actual_minutes: int = None):
    db_task = get_task_by_id(db, task_id, user_id)
    
    db_task.status = "done"
    if actual_minutes is not None:
        db_task.actual_minutes = actual_minutes
    db_task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    task = get_task_by_id(db, task_id, user_id)
    db.delete(task)
    db.commit()
    return {"ok": True}


def export_tasks_csv(db: Session, user_id: int):
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user_id).all()
    
    csv_lines = ["title,priority,deadline,status\n"]
    for task in tasks:
        csv_lines.append(f"{task.title},{task.priority},{task.deadline},{task.status}\n")
    
    return "".join(csv_lines)


def format_task_response(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "deadline": task.deadline,
        "estimated_minutes": task.estimated_minutes,
        "actual_minutes": task.actual_minutes,
        "status": task.status,
        "subject_id": task.subject_id,
        "completed_at": task.completed_at,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "subject_name": task.subject.name if task.subject else None,
    }
