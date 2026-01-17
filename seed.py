import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.models.user import User
from app.models.subject import Subject
from app.models.task import Task, TaskStatus
from app.core.security import hash_pwd


def create_demo_user(db: Session) -> User:
    demo_user = User(
        email="demo@example.com",
        username="demo",
        password=hash_pwd("demo123"),
        role="user"
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    print(f"Demo user created: {demo_user.username} ({demo_user.email})")
    return demo_user


def create_demo_subjects(db: Session, user_id: int) -> list[Subject]:
    subjects_data = [
        {
            "name": "Matematyka",
            "description": "Algebra, geometria i analiza matematyczna"
        },
        {
            "name": "Historia",
            "description": "Historia Polski i świata"
        },
        {
            "name": "Fizyka",
            "description": "Mechanika, termodynamika i elektromagnetyzm"
        },
        {
            "name": "Angielski",
            "description": "Gramatyka i konwersacja"
        },
        {
            "name": "Programowanie",
            "description": "Python, JavaScript i bazy danych"
        },
    ]

    subjects = []
    for subject_data in subjects_data:
        subject = Subject(
            name=subject_data["name"],
            description=subject_data["description"],
            user_id=user_id
        )
        db.add(subject)
        subjects.append(subject)

    db.commit()
    print(f"Created {len(subjects)} subjects")
    return subjects


def create_demo_tasks(db: Session, subjects: list[Subject]) -> list[Task]:
    task_templates = {
        "Matematyka": [
            {
                "title": "Rozwiąż zadania z rozdziału 5",
                "description": "Zadania 1-20 ze strony 145",
                "priority": "high",
                "estimated_minutes": 120
            },
            {
                "title": "Przygotuj się do sprawdzianu",
                "description": "Powtórzenie transformacji, funkcji kwadratowych",
                "priority": "high",
                "estimated_minutes": 180
            },
            {
                "title": "Oblicz całki oznaczone",
                "description": "Zadania z listy ćwiczeniowej",
                "priority": "medium",
                "estimated_minutes": 90
            },
        ],
        "Historia": [
            {
                "title": "Przeczytaj rozdział o wojnie trzydziestoletniej",
                "description": "Rozdziały 3-4, zanotuj główne daty i postaci",
                "priority": "medium",
                "estimated_minutes": 120
            },
            {
                "title": "Napisz esej o napoleonie",
                "description": "Min. 1500 słów, bibliografia wymagana",
                "priority": "high",
                "estimated_minutes": 240
            },
            {
                "title": "Przygotuj prezentację",
                "description": "Historia Polski w XX wieku - 10 slajdów",
                "priority": "medium",
                "estimated_minutes": 150
            },
        ],
        "Fizyka": [
            {
                "title": "Wykonaj doświadczenie",
                "description": "Pomiar przyspieszenia ziemskiego - przygotuj raport",
                "priority": "high",
                "estimated_minutes": 120
            },
            {
                "title": "Rozwiąż zadania o ruchu",
                "description": "Zadania 1-15 z podrozdziału 2.3",
                "priority": "medium",
                "estimated_minutes": 100
            },
            {
                "title": "Test z optyki",
                "description": "Przygotowanie do testu - 60 minut",
                "priority": "high",
                "estimated_minutes": 90
            },
        ],
        "Angielski": [
            {
                "title": "Naucz się słownictwa",
                "description": "Unit 5: 50 nowych słów i wyrażeń",
                "priority": "medium",
                "estimated_minutes": 60
            },
            {
                "title": "Napisz list do przyjaciela",
                "description": "Min. 200 słów, gramatycznie poprawny",
                "priority": "low",
                "estimated_minutes": 60
            },
            {
                "title": "Posłuchaj podcastu i wykonaj ćwiczenia",
                "description": "BBC Learning English - 30 minut słuchania",
                "priority": "medium",
                "estimated_minutes": 45
            },
        ],
        "Programowanie": [
            {
                "title": "Zaimplementuj funkcję sortowania",
                "description": "Bubble sort, selection sort, quick sort",
                "priority": "high",
                "estimated_minutes": 150
            },
            {
                "title": "Napraw buggi w projekcie",
                "description": "Błędy wymienione w issue #12",
                "priority": "high",
                "estimated_minutes": 180
            },
            {
                "title": "Dokumentuj kod",
                "description": "Dodaj docstring'i do wszystkich funkcji",
                "priority": "low",
                "estimated_minutes": 90
            },
        ],
    }

    tasks = []
    today = datetime.now()

    for subject in subjects:
        if subject.name in task_templates:
            for task_data in task_templates[subject.name]:
                days_offset = random.randint(1, 14)
                deadline = today + timedelta(days=days_offset)

                status = random.choice([
                    TaskStatus.todo,
                    TaskStatus.todo,
                    TaskStatus.todo,
                    TaskStatus.todo,
                    TaskStatus.todo
                ])

                completed_at = None
                if status == TaskStatus.done:
                    completed_at = today + timedelta(
                        days=random.randint(0, max(0, days_offset - 1))
                    )

                task = Task(
                    title=task_data["title"],
                    description=task_data["description"],
                    priority=task_data["priority"],
                    deadline=deadline,
                    estimated_minutes=task_data["estimated_minutes"],
                    status=status,
                    subject_id=subject.id,
                    completed_at=completed_at
                )
                db.add(task)
                tasks.append(task)

    db.commit()
    print(f"Created {len(tasks)} tasks")
    return tasks


def seed_database():
    print("\n" + "="*60)
    print("Seeding Database - Demo Study Planner")
    print("="*60 + "\n")

    # NOTE: Tables are now created by Alembic migrations
    # Make sure migrations have been applied before running this script
    print("Ensure migrations have been applied:")
    print("  $ alembic upgrade head\n")

    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.username == "demo").first()
        if existing_user:
            print("Warning: 'demo' user is already in database.")
            print("You can only run seed on empty database.")
            return

        user = create_demo_user(db)
        subjects = create_demo_subjects(db, user.id)
        tasks = create_demo_tasks(db, subjects)

        print("\n" + "="*60)
        print("Seeding Completed")
        print("="*60)
        print("\nApp auth data:")
        print(f"  Email: demo@example.com")
        print(f"  Password: demo123")
    except Exception as e:
        db.rollback()
        print(f"\nSeeding Failed: {str(e)}\n")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
