from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependency import get_current_user
from app.database.session import get_db
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectOut

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.post("/", response_model=SubjectOut)
def create_subject(subject: SubjectCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    s = Subject(**subject.model_dump(), user_id=user.id)
    db.add(s)
    db.commit()
    return s


@router.get("/", response_model=list[SubjectOut])
def list_subjects(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Subject).filter_by(user_id=user.id).all()


@router.put("/{subject_id}")
def update_subject(subject_id: int, data: SubjectCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    subject = db.query(Subject).filter_by(id=subject_id, user_id=user.id).first()
    if not subject:
        raise HTTPException(404, detail="Subject not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(subject, key, value)
    db.commit()
    db.refresh(subject)
    return subject


@router.delete("/{subject_id}")
def delete_subject(subject_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    subject = db.query(Subject).filter_by(id=subject_id, user_id=user.id).first()
    if not subject:
        raise HTTPException(404)
    db.delete(subject)
    db.commit()
    return {"ok": True}

