# Seed System - Demo Data Generator

Complete seed system for populating the Study Planner database with demo content.

## Quick Start

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run seed script
python3 seed.py
```

## Demo Account

```
Email:    demo@example.com
Password: demo123
```

## Reset Database

### Option 1: Remove Demo User Only
```bash
python3 -c "
from app.database.session import SessionLocal
from app.models.user import User
db = SessionLocal()
db.query(User).filter(User.username == 'demo').delete()
db.commit()
db.close()
print('Demo user removed')
"
```

### Option 2: Complete Reset
```bash
docker-compose down -v
docker-compose up -d
python3 seed.py
```