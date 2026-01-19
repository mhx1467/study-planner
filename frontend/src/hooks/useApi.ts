import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"

export function useClearCache() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.clear()
  }
}

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects")
      return response.data
    },
  })
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => {
      const response = await api.get(`/subjects/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await api.post("/subjects", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; name: string; description?: string }) => {
      const response = await api.put(`/subjects/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      queryClient.invalidateQueries({ queryKey: ["subjects", id] })
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/subjects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
    },
  })
}

export function useTasks(subject_id?: number) {
  return useQuery({
    queryKey: ["tasks", subject_id],
    queryFn: async () => {
      const url = subject_id ? `/tasks?subject_id=${subject_id}` : "/tasks"
      const response = await api.get(url)
      return response.data
    },
  })
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await api.get(`/tasks/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      subject_id?: number
      priority: "low" | "medium" | "high"
      deadline: string
      estimated_minutes: number
    }) => {
      const response = await api.post("/tasks", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: number
      title?: string
      description?: string
      subject_id?: number
      priority?: "low" | "medium" | "high"
      deadline?: string
      estimated_minutes?: number
      actual_minutes?: number
      status?: string
    }) => {
      const response = await api.put(`/tasks/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks", id] })
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
    },
  })
}

export function useSchedule(date?: Date) {
  return useQuery({
    queryKey: ["schedule", date?.toISOString()],
    queryFn: async () => {
      const url = date ? `/schedule?date=${date.toISOString().split("T")[0]}` : "/schedule"
      const response = await api.get(url)
      return response.data
    },
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      start_time: string
      end_time: string
      subject_id?: number
      task_id?: number
      color?: string
    }) => {
      const response = await api.post("/schedule", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] })
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
    },
  })
}

export function useGenerateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      end_date?: string
      short_break_minutes: number
      medium_break_minutes: number
      long_break_minutes: number
      long_break_after_minutes: number
    }) => {
      const response = await api.post("/schedule/generate", {}, {
        params: {
          end_date: params.end_date,
          short_break_minutes: params.short_break_minutes,
          medium_break_minutes: params.medium_break_minutes,
          long_break_minutes: params.long_break_minutes,
          long_break_after_minutes: params.long_break_after_minutes,
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] })
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
    },
  })
}

export function useExportTasksCSV() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get("/tasks/csv", {
        responseType: "blob",
      })
      return response.data
    },
  })
}

interface StatisticsData {
  totalTasks: number
  completedTasks: number
  completionRate: number
  totalHours: number
  totalScheduledHours: number
  tasksThisWeek: number
  completedThisWeek: number
  studyStreak: number
  pendingTasks: number
  inProgressTasks: number
  weeklyProgress: Array<{
    day: string
    tasksCompleted: number
    hoursSpent: number
  }>
  subjectStats: Array<{
    name: string
    tasksCompleted: number
    totalTasks: number
    completionRate: number
  }>
}

export function useStatistics(period: "week" | "month" | "all" = "week") {
  return useQuery<StatisticsData>({
    queryKey: ["statistics", period],
    queryFn: async () => {
      const [statsRes, weeklyRes, subjectsRes] = await Promise.all([
        api.get("/statistics"),
        api.get("/statistics/weekly"),
        api.get("/statistics/subjects"),
      ])
      
      return {
        totalTasks: statsRes.data.total_tasks,
        completedTasks: statsRes.data.completed_tasks,
        completionRate: statsRes.data.completion_rate,
        totalHours: statsRes.data.total_estimated_hours,
        totalScheduledHours: statsRes.data.total_scheduled_hours,
        tasksThisWeek: statsRes.data.tasks_this_week,
        completedThisWeek: statsRes.data.completed_this_week,
        studyStreak: statsRes.data.study_streak,
        pendingTasks: statsRes.data.pending_tasks,
        inProgressTasks: statsRes.data.in_progress_tasks,
        weeklyProgress: weeklyRes.data.map((day: any) => ({
          day: day.day,
          tasksCompleted: day.tasks_completed,
          hoursSpent: day.hours_studied,
        })),
        subjectStats: subjectsRes.data.map((subject: any) => ({
          name: subject.subject_name,
          tasksCompleted: subject.completed_tasks,
          totalTasks: subject.total_tasks,
          completionRate: subject.completion_rate,
        })),
      }
    },
  })
}
