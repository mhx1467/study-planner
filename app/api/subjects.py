from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.schemas.subject import SubjectCreate, SubjectOut
from app.services import subjects as subject_service

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.post("/", response_model=SubjectOut)
def create_subject(subject: SubjectCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return subject_service.create_subject(db, user.id, subject.name, subject.description)

@router.get("/", response_model=list[SubjectOut])
def list_subjects(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return subject_service.get_user_subjects(db, user.id)

@router.put("/{subject_id}")
def update_subject(subject_id: int, data: SubjectCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return subject_service.update_subject(db, subject_id, user.id, data.model_dump(exclude_unset=True))

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return subject_service.delete_subject(db, subject_id, user.id)

