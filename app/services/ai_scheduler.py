from datetime import datetime, timedelta
from typing import List, Dict
import math

def generate_schedule_from_tasks(tasks, user_id: int) -> List[Dict]:
    """
    Generate an AI-powered study schedule based on user's tasks.
    
    Algorithm:
    1. Sort tasks by deadline (earliest first)
    2. Calculate total study hours needed
    3. Distribute across available days before deadline
    4. Create 90-minute study blocks with 15-minute breaks
    """
    
    if not tasks:
        return []
    
    schedule_entries = []
    now = datetime.utcnow()
    
    for task in tasks:
        if not task.deadline or task.deadline <= now:
            continue
        
        # Calculate study blocks needed (assuming 90-minute blocks)
        total_minutes = task.estimated_minutes or 120
        block_minutes = 90
        num_blocks = math.ceil(total_minutes / block_minutes)
        
        # Days available until deadline
        days_until_deadline = max(1, (task.deadline - now).days)
        
        # Distribute blocks across available days
        blocks_per_day = max(1, num_blocks // max(1, days_until_deadline))
        
        # Create schedule entries for each block
        current_date = now.replace(hour=9, minute=0, second=0, microsecond=0)  # Start at 9 AM
        
        for block_num in range(num_blocks):
            if current_date >= task.deadline:
                break
            
            start_time = current_date
            end_time = start_time + timedelta(minutes=min(block_minutes, total_minutes - (block_num * block_minutes)))
            
            # Skip if time slot is past deadline
            if start_time >= task.deadline:
                break
            
            # Move to next day if needed
            if block_num > 0 and block_num % blocks_per_day == 0:
                current_date = (current_date + timedelta(days=1)).replace(hour=9, minute=0)
            
            schedule_entries.append({
                "title": f"{task.subject_id and 'Study' or 'Work on'}: {task.title}",
                "description": f"Study block {block_num + 1} of {num_blocks}",
                "start_time": start_time,
                "end_time": end_time,
                "task_id": task.id,
                "subject_id": task.subject_id,
                "user_id": user_id,
                "color": get_priority_color(task.priority)
            })
            
            # Add 15-minute break
            current_date = end_time + timedelta(minutes=15)
        
        # Move to next day for next task
        current_date = (current_date + timedelta(days=1)).replace(hour=9, minute=0)
    
    return schedule_entries

def get_priority_color(priority: str) -> str:
    """Map task priority to display color"""
    color_map = {
        "high": "red",
        "medium": "yellow",
        "low": "blue",
        "urgent": "red"
    }
    return color_map.get(priority, "blue")
