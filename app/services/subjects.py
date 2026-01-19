from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.subject import Subject


def create_subject(db: Session, user_id: int, name: str, description: str = None):
    subject = Subject(name=name, description=description, user_id=user_id)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def get_user_subjects(db: Session, user_id: int):
    return db.query(Subject).filter(Subject.user_id == user_id).all()


def get_subject_by_id(db: Session, subject_id: int, user_id: int):
    subject = db.query(Subject).filter(
        Subject.id == subject_id,
        Subject.user_id == user_id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


def update_subject(db: Session, subject_id: int, user_id: int, update_data: dict):
    subject = get_subject_by_id(db, subject_id, user_id)
    
    for key, value in update_data.items():
        if value is not None:
            setattr(subject, key, value)
    
    db.commit()
    db.refresh(subject)
    return subject


def delete_subject(db: Session, subject_id: int, user_id: int):
    subject = get_subject_by_id(db, subject_id, user_id)
    db.delete(subject)
    db.commit()
    return {"ok": True}
