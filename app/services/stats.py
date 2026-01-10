from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.task import Task, TaskStatus
from app.models.schedule import Schedule
from sqlalchemy import func

def completion_percentage(tasks):
    if not tasks:
        return 0
    done = len([t for t in tasks if t.status == TaskStatus.done])
    return round(done / len(tasks) * 100, 2)

def get_user_statistics(db: Session, user_id: int):
    from app.models.subject import Subject
    
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user_id).all()
    
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.status == TaskStatus.done])
    completion_rate = completion_percentage(tasks)
    
    total_minutes = sum([t.estimated_minutes for t in tasks if t.estimated_minutes])
    total_hours = round(total_minutes / 60, 2)
    
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())
    week_end = week_start + timedelta(days=7)
    
    tasks_this_week = [t for t in tasks if t.deadline and week_start <= t.deadline <= week_end]
    completed_this_week = [t for t in tasks_this_week if t.status == TaskStatus.done]
    
    study_streak = calculate_study_streak(db, user_id)
    
    schedules = db.query(Schedule).filter(Schedule.user_id == user_id).all()
    total_scheduled_minutes = sum([(s.end_time - s.start_time).total_seconds() / 60 for s in schedules])
    total_scheduled_hours = round(total_scheduled_minutes / 60, 2)
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": completion_rate,
        "total_estimated_hours": total_hours,
        "total_scheduled_hours": total_scheduled_hours,
        "tasks_this_week": len(tasks_this_week),
        "completed_this_week": len(completed_this_week),
        "study_streak": study_streak,
        "pending_tasks": len([t for t in tasks if t.status == TaskStatus.todo]),
        "in_progress_tasks": len([t for t in tasks if t.status == TaskStatus.in_progress])
    }

def calculate_study_streak(db: Session, user_id: int) -> int:
    """Calculate consecutive days with completed tasks (counting today as day 1)"""
    from app.models.subject import Subject
    
    tasks = db.query(Task).join(Subject).filter(
        Subject.user_id == user_id,
        Task.status == TaskStatus.done
    ).order_by(Task.completed_at.desc()).all()
    
    if not tasks:
        return 0
    
    # Get unique dates with completed tasks, most recent first
    completed_dates = []
    seen_dates = set()
    for task in tasks:
        if task.completed_at:
            task_date = task.completed_at.date()
            if task_date not in seen_dates:
                completed_dates.append(task_date)
                seen_dates.add(task_date)
    
    if not completed_dates:
        return 0
    
    # Check if the most recent completion is today or yesterday
    today = datetime.utcnow().date()
    if completed_dates[0] != today and completed_dates[0] != today - timedelta(days=1):
        return 0
    
    # Count consecutive days from most recent backwards
    streak = 1
    for i in range(1, len(completed_dates)):
        expected_date = completed_dates[0] - timedelta(days=i)
        if completed_dates[i] == expected_date:
            streak += 1
        else:
            break
    
    return streak

def get_weekly_progress(db: Session, user_id: int):
    from app.models.subject import Subject
    
    now = datetime.utcnow()
    # Use date arithmetic to get midnight on Monday
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    
    daily_stats = []
    
    for day_offset in range(7):
        day_start = week_start + timedelta(days=day_offset)
        day_end = day_start + timedelta(days=1)
        
        day_name = day_start.strftime("%A")
        
        # Count tasks completed on this day based on completed_at timestamp
        completed_tasks = db.query(Task).join(Subject).filter(
            Subject.user_id == user_id,
            Task.status == TaskStatus.done,
            Task.completed_at >= day_start,
            Task.completed_at < day_end
        ).all()
        
        tasks_completed = len(completed_tasks)
        
        # Calculate actual hours from completed tasks
        total_actual_minutes = sum([t.actual_minutes for t in completed_tasks if t.actual_minutes]) if completed_tasks else 0
        actual_hours = total_actual_minutes / 60 if total_actual_minutes > 0 else 0.0
        
        daily_stats.append({
            "day": day_name,
            "tasks_completed": tasks_completed,
            "hours_studied": round(float(actual_hours), 2)
        })
    
    return daily_stats

def get_subject_breakdown(db: Session, user_id: int):
    """Get task breakdown by subject"""
    from app.models.subject import Subject
    
    subjects = db.query(Subject).filter(Subject.user_id == user_id).all()
    breakdown = []
    
    for subject in subjects:
        tasks = db.query(Task).filter(Task.subject_id == subject.id).all()
        completed = len([t for t in tasks if t.status == TaskStatus.done])
        
        breakdown.append({
            "subject_name": subject.name,
            "total_tasks": len(tasks),
            "completed_tasks": completed,
            "completion_rate": completion_percentage(tasks) if tasks else 0
        })
    
    return breakdown
