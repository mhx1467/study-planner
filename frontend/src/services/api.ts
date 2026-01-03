import axios from "axios"
import type { AxiosInstance, AxiosError } from "axios"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

// Create a separate axios instance for direct API calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Setup API interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = api
    // Load token from localStorage on initialization
    this.loadToken()
  }

  private loadToken() {
    const token = localStorage.getItem("access_token")
    if (token) {
      this.setAuthHeader(token)
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login", credentials)
    const token = response.data.access_token
    this.setAuthHeader(token)
    localStorage.setItem("access_token", token)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/register", data)
    const token = response.data.access_token
    this.setAuthHeader(token)
    localStorage.setItem("access_token", token)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout")
    } finally {
      localStorage.removeItem("access_token")
      delete this.client.defaults.headers.common["Authorization"]
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>("/auth/me")
    return response.data
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  // Subject endpoints
  async getSubjects() {
    const response = await this.client.get("/subjects")
    return response.data
  }

  async createSubject(data: any) {
    const response = await this.client.post("/subjects", data)
    return response.data
  }

  async updateSubject(id: string, data: any) {
    const response = await this.client.put(`/subjects/${id}`, data)
    return response.data
  }

  async deleteSubject(id: string) {
    await this.client.delete(`/subjects/${id}`)
  }

  // Task endpoints
  async getTasks(filters?: any) {
    const response = await this.client.get("/tasks", { params: filters })
    return response.data
  }

  async createTask(data: any) {
    const response = await this.client.post("/tasks", data)
    return response.data
  }

  async updateTask(id: string, data: any) {
    const response = await this.client.put(`/tasks/${id}`, data)
    return response.data
  }

  async deleteTask(id: string) {
    await this.client.delete(`/tasks/${id}`)
  }

  // Schedule endpoints
  async generateSchedule(params?: any) {
    const response = await this.client.get("/schedule/generate", { params })
    return response.data
  }

  async getSchedule(params?: any) {
    const response = await this.client.get("/schedule", { params })
    return response.data
  }

  // Statistics endpoints
  async getStatistics() {
    const response = await this.client.get("/statistics")
    return response.data
  }

  // Export endpoints
  async exportData(format: "csv" | "json") {
    const response = await this.client.get(`/export/${format}`, {
      responseType: "blob",
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
