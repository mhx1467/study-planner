from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
import os
from app.database.base import Base

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.models.user import User
from app.models.subject import Subject
from app.models.task import Task
from app.models.schedule import Schedule

target_metadata = Base.metadata

from dotenv import load_dotenv

load_dotenv()

def get_engine_url():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        # Fallback to alembic.ini configuration
        db_url = config.get_main_option("sqlalchemy.url")
    return db_url


def run_migrations_offline() -> None:
    url = get_engine_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    db_url = get_engine_url()
    
    configuration = config.get_section(config.config_ini_section) or {}
    if db_url:
        configuration["sqlalchemy.url"] = db_url
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
