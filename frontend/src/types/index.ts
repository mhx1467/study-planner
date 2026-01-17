// User types
export interface User {
  id: number
  email: string
  username: string
  role?: string
}

// Subject types
export interface Subject {
  id: number
  name: string
  description?: string
  color?: string
  created_at?: string
  updated_at?: string
}

// Task types
export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: number
  subject_id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string
  estimated_minutes: number
  actual_minutes?: number
  completed_at?: string
  created_at: string
  updated_at: string
}

// Schedule types
export interface ScheduleItem {
  id: string
  task_id: string
  subject_id: string
  scheduled_date: string
  start_time: string
  end_time: string
  duration_hours: number
  has_conflict: boolean
}

// Statistics types
export interface TaskStats {
  total_tasks: number
  completed_tasks: number
  completion_rate: number
  pending_tasks: number
}

export interface SubjectStats {
  subject_id: string
  subject_name: string
  total_time_hours: number
  completed_tasks: number
  total_tasks: number
}

// Auth response types
export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}
