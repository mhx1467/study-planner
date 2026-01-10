from datetime import timedelta, timezone, datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.models.subject import Subject
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskComplete

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/")
def create_task(task: TaskCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == task.subject_id, Subject.user_id == user.id).first()
    if not subject:
        raise HTTPException(403, "Subject not found or access denied")
    db_task = Task(**task.model_dump(), status="todo")
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/")
def list_tasks(status: str | None = None, user=Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(Task).join(Subject).filter(Subject.user_id == user.id)
    if status:
        q = q.filter(Task.status == status)
    tasks = q.order_by(Task.deadline).all()
    
    # Add subject_name to each task
    result = []
    for task in tasks:
        task_dict = {
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
        result.append(task_dict)
    
    return result

@router.get("/{task_id}")
def get_task(task_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).join(Subject).filter(Task.id == task_id, Subject.user_id == user.id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    
    # Add subject_name to response
    task_dict = {
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
    return task_dict

@router.put("/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).join(Subject).filter(Task.id == task_id, Subject.user_id == user.id).first()
    if not db_task:
        raise HTTPException(404)
    
    # Handle completed_at timestamp when marking as done
    update_data = task_update.model_dump(exclude_unset=True)
    if 'status' in update_data:
        if update_data['status'] == 'done' and db_task.status != 'done':
            # Mark completion time when transitioning to done
            db_task.completed_at = datetime.utcnow()
        elif update_data['status'] != 'done' and db_task.status == 'done':
            # Clear completion time when reverting from done
            db_task.completed_at = None
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.post("/{task_id}/complete")
def complete_task(task_id: int, complete_data: TaskComplete, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).join(Subject).filter(Task.id == task_id, Subject.user_id == user.id).first()
    if not db_task:
        raise HTTPException(404, "Task not found")
    
    db_task.status = "done"
    db_task.actual_minutes = complete_data.actual_minutes
    db_task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).join(Subject).filter(Task.id == task_id, Subject.user_id == user.id).first()
    if not task:
        raise HTTPException(404)
    db.delete(task)
    db.commit()

@router.get("/csv")
def export_csv(user=Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user.id).all()

    def generate():
        yield "title,priority,deadline,status\n"
        for t in tasks:
            yield f"{t.title},{t.priority},{t.deadline},{t.status}\n"

    return StreamingResponse(generate(), media_type="text/csv")
