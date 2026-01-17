# Database Migrations Guide

This guide explains how to use Alembic for database migrations in the Study Planner project.

## Overview

**Alembic** is a database migration tool for SQLAlchemy that tracks schema changes over time. Instead of the application auto-creating tables on startup, migrations provide:

- Version-controlled schema changes
- Reversible updates (upgrade/downgrade)
- Audit trail of all database changes
- Safe deployment to production
- Reproducible database setup

## Quick Start

### 1. Apply Migrations to Create Tables

```bash
# Start PostgreSQL
docker-compose up -d

# Apply all pending migrations
alembic upgrade head
```

This will create all tables in the database.

### 2. Seed the Database

```bash
python3 seed.py
```

### 3. Run the Application

```bash
uvicorn app.main:app --reload
```

## Common Migration Commands

### View Current Migration Status

```bash
alembic current
```

Shows which migration version the database is at.

### View Migration History

```bash
alembic history --oneline
```

Lists all migrations that have been applied.

### Apply All Pending Migrations

```bash
alembic upgrade head
```

Updates database to the latest migration.

### Upgrade to Specific Migration

```bash
alembic upgrade <revision>
```

Example:
```bash
alembic upgrade 001_initial_schema
```

### Downgrade (Rollback) Migrations

```bash
# Downgrade one migration
alembic downgrade -1

# Downgrade to specific version
alembic downgrade 001_initial_schema

# Downgrade all migrations
alembic downgrade base
```

**WARNING:** Downgrading deletes data. Use with caution in production.

### Create New Migration

When you modify models, create a new migration:

```bash
# Auto-detect changes
alembic revision --autogenerate -m "Description of changes"

# Manual migration (if auto-detect doesn't work)
alembic revision -m "Description of changes"
```

Then edit the generated file in `alembic/versions/` if needed.

## Workflow

### During Development

1. **Create/Modify Model** in `app/models/`
2. **Generate Migration**:
   ```bash
   alembic revision --autogenerate -m "Feature description"
   ```
3. **Review Migration** in `alembic/versions/`
4. **Test Migration**:
   ```bash
   alembic upgrade head
   # Test your changes
   alembic downgrade -1  # Rollback
   alembic upgrade head  # Reapply
   ```
5. **Commit** migration file to git