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
    """Get comprehensive statistics for a user"""
    from app.models.subject import Subject
    
    # Get all user tasks
    tasks = db.query(Task).join(Subject).filter(Subject.user_id == user_id).all()
    
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.status == TaskStatus.done])
    completion_rate = completion_percentage(tasks)
    
    # Calculate total estimated study hours
    total_minutes = sum([t.estimated_minutes for t in tasks if t.estimated_minutes])
    total_hours = round(total_minutes / 60, 2)
    
    # Get this week's tasks
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())
    week_end = week_start + timedelta(days=7)
    
    tasks_this_week = [t for t in tasks if t.deadline and week_start <= t.deadline <= week_end]
    completed_this_week = [t for t in tasks_this_week if t.status == TaskStatus.done]
    
    # Get study streak (consecutive days with scheduled study)
    study_streak = calculate_study_streak(db, user_id)
    
    # Get scheduled hours
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
    """Calculate consecutive days with scheduled study"""
    schedules = db.query(Schedule).filter(Schedule.user_id == user_id).order_by(Schedule.start_time.desc()).all()
    
    if not schedules:
        return 0
    
    streak = 0
    current_date = datetime.utcnow().date()
    
    for schedule in schedules:
        schedule_date = schedule.start_time.date()
        
        if schedule_date == current_date or schedule_date == current_date - timedelta(days=1):
            if schedule_date == current_date - timedelta(days=1):
                streak += 1
                current_date = schedule_date
            continue
        else:
            break
    
    return streak

def get_weekly_progress(db: Session, user_id: int):
    """Get weekly progress data for charts"""
    from app.models.subject import Subject
    
    # Get progress for each day of the week
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())
    
    daily_stats = []
    
    for day_offset in range(7):
        day_start = week_start + timedelta(days=day_offset)
        day_end = day_start + timedelta(days=1)
        
        day_name = day_start.strftime("%A")
        
        # Get tasks completed on this day
        tasks_completed = db.query(Task).join(Subject).filter(
            Subject.user_id == user_id,
            Task.status == TaskStatus.done,
            Task.deadline >= day_start,
            Task.deadline < day_end
        ).count()
        
        # Get scheduled hours on this day
        scheduled = db.query(func.sum(
            func.cast(Schedule.end_time - Schedule.start_time, 'INTERVAL')
        )).filter(
            Schedule.user_id == user_id,
            Schedule.start_time >= day_start,
            Schedule.start_time < day_end
        ).scalar() or 0
        
        scheduled_hours = scheduled.total_seconds() / 3600 if scheduled else 0
        
        daily_stats.append({
            "day": day_name,
            "tasks_completed": tasks_completed,
            "hours_studied": round(scheduled_hours, 2)
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
