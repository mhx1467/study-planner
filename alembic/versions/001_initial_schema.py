"""Initial migration: create users, subjects, tasks, schedules tables

Revision ID: 001_initial_schema
Revises: 
Create Date: 2025-12-03 11:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False, server_default='user'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    op.create_table(
        'subjects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('priority', sa.String(), nullable=True),
        sa.Column('deadline', sa.DateTime(), nullable=True),
        sa.Column('estimated_minutes', sa.Integer(), nullable=True),
        sa.Column('actual_minutes', sa.Integer(), nullable=True),
        sa.Column('status', postgresql.ENUM('todo', 'in_progress', 'done', name='taskstatus'), nullable=False),
        sa.Column('subject_id', sa.Integer(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'schedules',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('subject_id', sa.Integer(), nullable=True),
        sa.Column('color', sa.String(), nullable=False, server_default='blue'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_schedules_user_id'), 'schedules', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_schedules_user_id'), table_name='schedules')
    op.drop_table('schedules')
    op.drop_table('tasks')
    op.drop_table('subjects')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
