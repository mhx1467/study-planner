from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskComplete
from app.services import tasks as task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/")
def create_task(task: TaskCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return task_service.create_task(db, user.id, task.model_dump())

@router.get("/")
def list_tasks(status: str | None = None, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return task_service.list_user_tasks(db, user.id, status)

@router.get("/csv")
def export_csv(user=Depends(get_current_user), db: Session = Depends(get_db)):
    csv_content = task_service.export_tasks_csv(db, user.id)
    
    def generate():
        yield csv_content
    
    return StreamingResponse(generate(), media_type="text/csv")

@router.get("/{task_id}")
def get_task(task_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, task_id, user.id)
    return task_service.format_task_response(task)

@router.put("/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return task_service.update_task(db, task_id, user.id, task_update.model_dump(exclude_unset=True))

@router.post("/{task_id}/complete")
def complete_task(task_id: int, complete_data: TaskComplete, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return task_service.complete_task(db, task_id, user.id, complete_data.actual_minutes)

@router.delete("/{task_id}")
def delete_task(task_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return task_service.delete_task(db, task_id, user.id)
