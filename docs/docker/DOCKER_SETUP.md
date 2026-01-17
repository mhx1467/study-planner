# Docker Setup for Study Planner

This guide explains how to set up and run the PostgreSQL database using Docker Compose.

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### 1. Start PostgreSQL Container

```bash
docker-compose up -d
```

This will:
- Pull the PostgreSQL 15 Alpine image (if not already present)
- Start a PostgreSQL container named `study_planner_db`
- Create a database named `study_planner`
- Mount a volume for data persistence
- Make PostgreSQL available at `localhost:5432`

### 2. Verify PostgreSQL is Running

```bash
# Check container status
docker-compose ps

# Check if database is healthy
docker-compose logs postgres
```

### 3. Connect to PostgreSQL

Using psql (PostgreSQL CLI):
```bash
docker-compose exec postgres psql -U postgres -d study_planner
```

Using a database client (e.g., pgAdmin, DBeaver):
- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `postgres`
- Database: `study_planner`

### 4. Run Your FastAPI Application

In another terminal:
```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload
```

The application will automatically create tables on startup.

## Environment Variables

The Docker Compose setup uses environment variables from `.env` file:

```env
POSTGRES_USER=postgres           # Database user
POSTGRES_PASSWORD=postgres       # Database password
POSTGRES_DB=study_planner        # Database name
POSTGRES_PORT=5432             # Port to expose
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/study_planner
```

For Docker networking (if running FastAPI in a container):
- Use `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/study_planner`
- Replace `localhost` with the service name `postgres`

## Common Commands

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# Stop services and remove volumes (delete all data)
docker-compose down -v

# View logs
docker-compose logs -f postgres

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d study_planner

# Execute SQL command
docker-compose exec postgres psql -U postgres -d study_planner -c "SELECT * FROM users;"

# Backup database
docker-compose exec postgres pg_dump -U postgres study_planner > backup.sql

# Restore database
docker-compose exec postgres psql -U postgres study_planner < backup.sql
```

## Data Persistence

- Database files are stored in a Docker volume named `postgres_data`
- Data persists even after containers are stopped
- To delete all data, run: `docker-compose down -v`

## Health Check

The PostgreSQL service includes a health check that:
- Runs every 10 seconds
- Waits 5 seconds for a response
- Retries up to 5 times before marking as unhealthy

Check status:
```bash
docker-compose ps
```

## Troubleshooting

### Port Already in Use
If port 5432 is already in use, change it in `.env`:
```env
POSTGRES_PORT=5433
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/study_planner
```

### Connection Refused
Ensure the container is running:
```bash
docker-compose ps
docker-compose logs postgres
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d
```

## Development Tips

### Use pgAdmin for GUI Management
Add to `docker-compose.yml`:
```yaml
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - study_planner_network
```

Then run: `docker-compose up -d` and access at `http://localhost:5050`
