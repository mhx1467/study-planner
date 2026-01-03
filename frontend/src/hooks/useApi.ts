import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"

// Subjects Hooks
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

// Tasks Hooks
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
      due_date: string
    }) => {
      const response = await api.post("/tasks", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
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
      due_date?: string
      completed?: boolean
    }) => {
      const response = await api.put(`/tasks/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks", id] })
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
    },
  })
}

// Schedule Hooks
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

export function useGenerateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/schedule/generate", {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] })
    },
  })
}

// Statistics Hooks
export function useStatistics(period: "week" | "month" | "all" = "week") {
  return useQuery({
    queryKey: ["statistics", period],
    queryFn: async () => {
      const response = await api.get(`/statistics?period=${period}`)
      return response.data
    },
  })
}
