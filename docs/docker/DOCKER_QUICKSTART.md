# PostgreSQL Docker Compose Setup - Quick Start

## Start PostgreSQL

```bash
docker-compose up -d
```

This will start a PostgreSQL 15 container with:
- **Database name:** `study_planner`
- **Username:** `postgres`
- **Password:** `postgres`
- **Port:** `5432`
- **Container name:** `study_planner_db`

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run the Application

```bash
uvicorn app.main:app --reload
```

The application will automatically create tables in PostgreSQL on startup.

## Verify Setup

```bash
# Check container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d study_planner
```

## Stop PostgreSQL

```bash
docker-compose down
```

To remove all data as well:
```bash
docker-compose down -v
```

## Connection Details

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `study_planner`
- **Username:** `postgres`
- **Password:** `postgres`

For more information, see `DOCKER_SETUP.md`
