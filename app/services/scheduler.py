from datetime import datetime, timedelta
from typing import List, Dict, Optional
import math

def generate_schedule_from_tasks(
    tasks, 
    user_id: int,
    end_date: Optional[datetime] = None,
    short_break_minutes: int = 5,
    medium_break_minutes: int = 15,
    long_break_minutes: int = 30,
    long_break_after_minutes: int = 90,
) -> List[Dict]:
    """
    Algorithm:
    1. Sort tasks by deadline (earliest first), then by priority (high first)
    2. Calculate total study hours needed per task
    3. Create 90-minute study blocks with breaks in between
    4. Schedule blocks across days before deadline
    5. For tasks with same deadline, distribute work evenly across available time
    6. Add short breaks between study blocks
    7. Add medium breaks within long tasks
    8. Add long breaks between different tasks
    """
    
    if not tasks:
        return []
    
    schedule_entries = []
    now = datetime.utcnow()
    
    priority_order = {"high": 0, "urgent": 0, "medium": 1, "low": 2}
    sorted_tasks = sorted(
        tasks, 
        key=lambda t: (
            t.deadline or datetime.max,
            priority_order.get(t.priority, 2)
        )
    )
    
    # track the current scheduling position
    current_scheduling_time = now.replace(hour=9, minute=0, second=0, microsecond=0)
    
    for task_idx, task in enumerate(sorted_tasks):
        if not task.deadline or task.deadline <= now:
            continue
        
        schedule_until = end_date if end_date else task.deadline
        
        # calculate study blocks needed
        total_minutes = task.estimated_minutes or 120
        block_minutes = 90
        num_blocks = math.ceil(total_minutes / block_minutes)
        minutes_scheduled = 0
        
        # create schedule entries for each block
        for block_num in range(num_blocks):
            start_time = current_scheduling_time
            remaining_minutes = total_minutes - minutes_scheduled
            block_duration = min(block_minutes, remaining_minutes)
            end_time = start_time + timedelta(minutes=block_duration)
            
            # check if this block fits before the deadline/end_date
            if start_time >= schedule_until:
                break
            
            # if end time exceeds deadline, truncate it
            if end_time > schedule_until:
                end_time = schedule_until
            
            schedule_entries.append({
                "title": f"{task.title}",
                "description": f"Blok {block_num + 1} z {num_blocks}",
                "start_time": start_time,
                "end_time": end_time,
                "task_id": task.id,
                "subject_id": task.subject_id,
                "user_id": user_id,
                "color": get_priority_color(task.priority)
            })
            
            minutes_scheduled += block_duration
            
            # add break after this block
            if block_num < num_blocks - 1:
                # within-task break: use medium break for long tasks
                if block_duration >= long_break_after_minutes:
                    break_minutes = medium_break_minutes
                else:
                    break_minutes = short_break_minutes
            elif task_idx < len(sorted_tasks) - 1:
                # between-task break: use long break
                break_minutes = long_break_minutes
            else:
                break_minutes = 0
            
            if break_minutes > 0:
                break_start = end_time
                break_end = break_start + timedelta(minutes=break_minutes)
                
                # only add break if it fits before schedule_until
                if break_start < schedule_until:
                    schedule_entries.append({
                        "title": "Przerwa",
                        "description": f"{break_minutes}-min przerwy",
                        "start_time": break_start,
                        "end_time": min(break_end, schedule_until),
                        "task_id": None,
                        "subject_id": None,
                        "user_id": user_id,
                        "color": "gray"
                    })
                    current_scheduling_time = break_end
            else:
                current_scheduling_time = end_time
            
            # if next block would be after 18:00, move to next day at 9:00
            if current_scheduling_time.hour >= 18:
                current_scheduling_time = (current_scheduling_time + timedelta(days=1)).replace(hour=9, minute=0, second=0, microsecond=0)
    
    return schedule_entries

def get_priority_color(priority: str) -> str:
    color_map = {
        "high": "red",
        "medium": "yellow",
        "low": "blue",
        "urgent": "red"
    }
    return color_map.get(priority, "blue")

