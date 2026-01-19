# StudyPlanner

A comprehensive web application for managing study tasks, subjects, and schedules with real-time progress tracking and analytics.

## Features

- **Task Management** - Create, organize, and track educational tasks with priorities and deadlines
- **Subject Organization** - Manage different subjects and organize tasks by subject
- **Smart Scheduling** - Automatically generate study schedules with built-in break times
- **Statistics & Analytics** - Track completion rates, study streaks, and subject progress
- **CSV Export** - Export your tasks as CSV files for external analysis
- **Multi-language Support** - Available in English and Polish
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Automatic synchronization across all open tabs

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Alembic** - Database migrations
- **JWT** - Authentication and authorization

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Vite** - Fast build tool

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### Local Development Setup

#### 1. Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd study-planner

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your database URL and secret key

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables (if needed)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`