import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { PreferencesProvider } from "@/contexts/PreferencesContext"
import { ToastProvider, useToast } from "@/contexts/ToastContext"
import { setupApiErrorInterceptor } from "@/services/apiInterceptor"
import { ToastContainer } from "@/components/ToastContainer"
import { Navigation } from "@/components/Navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { SubjectsPage } from "@/pages/SubjectsPage"
import { TasksPage } from "@/pages/TasksPage"
import { SchedulePage } from "@/pages/SchedulePage"
import { StatisticsPage } from "@/pages/StatisticsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import "./index.css"

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
})

function AppContent() {
  const toast = useToast()

  useEffect(() => {
    const cleanup = setupApiErrorInterceptor(toast)
    return cleanup
  }, [toast])

  return (
    <Router>
      <LanguageProvider>
        <PreferencesProvider>
          <AuthProvider>
            <Navigation />
            <ToastContainer />
            <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <SubjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
           <Route
             path="/statistics"
             element={
               <ProtectedRoute>
                 <StatisticsPage />
               </ProtectedRoute>
             }
           />
           <Route
             path="/settings"
             element={
               <ProtectedRoute>
                 <SettingsPage />
               </ProtectedRoute>
             }
           />
           <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
        </PreferencesProvider>
      </LanguageProvider>
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App

