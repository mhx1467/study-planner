# Migrations Setup - Quick Start

Complete migration system with Alembic is now in place. Here's how to use it:

## One-Time Setup

### 1. Start PostgreSQL
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

(Alembic is already added to `requirements.txt`)

### 3. Apply Migrations to Create Tables
```bash
alembic upgrade head
```

This creates all database tables based on the migrations.

### 4. Seed Database with Demo Data
```bash
python3 seed.py
```

### 5. Start Application
```bash
uvicorn app.main:app --reload
```

### If You Modify a Model

1. Create new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

2. Review migration in `alembic/versions/`

3. Apply migration:
```bash
alembic upgrade head
```