import React, { createContext, useCallback, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number // in milliseconds, 0 = no auto-close
}

export interface ToastContextType {
  toasts: Toast[]
  showToast: (type: ToastType, message: string, description?: string, duration?: number) => void
  showSuccess: (message: string, description?: string, duration?: number) => void
  showError: (message: string, description?: string, duration?: number) => void
  showInfo: (message: string, description?: string, duration?: number) => void
  showWarning: (message: string, description?: string, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, description?: string, duration: number = 5000) => {
      const id = generateId()
      const newToast: Toast = {
        id,
        type,
        message,
        description,
        duration,
      }

      setToasts(prev => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const showSuccess = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('success', message, description, duration)
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('error', message, description, duration ?? 7000) // Longer duration for errors
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('info', message, description, duration)
    },
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, description?: string, duration?: number) => {
      showToast('warning', message, description, duration ?? 6000)
    },
    [showToast]
  )

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextType = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast,
    clearToasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
