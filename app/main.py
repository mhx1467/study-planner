from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.database.base import Base
from app.database.session import engine
from app.api import auth, subjects, tasks, schedule
from app.services import statistics
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

# NOTE: Tables are now created by Alembic migrations
# Do NOT auto-create tables here anymore

app = FastAPI(
    title="Study Planner API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(tasks.router)
app.include_router(schedule.router)
app.include_router(statistics.router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation failed",
            "errors": exc.errors()
        },
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Database error occurred",
            "error": "database_error"
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": "internal_error"
        },
    )