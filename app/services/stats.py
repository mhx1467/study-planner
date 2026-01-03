def completion_percentage(tasks):
    if not tasks:
        return 0
    done = len([t for t in tasks if t.status == "done"])
    return round(done / len(tasks) * 100, 2)