import React from 'react'
import { useToast, type ToastType } from '@/contexts/ToastContext'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import clsx from 'clsx'

const getToastStyles = (type: ToastType) => {
  const baseStyles = 'flex items-start gap-3 rounded-lg shadow-lg border p-4 backdrop-blur-sm'

  switch (type) {
    case 'success':
      return clsx(
        baseStyles,
        'bg-green-50/95 border-green-200 text-green-900'
      )
    case 'error':
      return clsx(
        baseStyles,
        'bg-red-50/95 border-red-200 text-red-900'
      )
    case 'warning':
      return clsx(
        baseStyles,
        'bg-yellow-50/95 border-yellow-200 text-yellow-900'
      )
    case 'info':
      return clsx(
        baseStyles,
        'bg-blue-50/95 border-blue-200 text-blue-900'
      )
    default:
      return baseStyles
  }
}

const getIconComponent = (type: ToastType) => {
  const iconProps = 'h-5 w-5 flex-shrink-0 mt-0.5'

  switch (type) {
    case 'success':
      return <CheckCircle className={clsx(iconProps, 'text-green-600')} />
    case 'error':
      return <AlertCircle className={clsx(iconProps, 'text-red-600')} />
    case 'warning':
      return <AlertTriangle className={clsx(iconProps, 'text-yellow-600')} />
    case 'info':
      return <Info className={clsx(iconProps, 'text-blue-600')} />
    default:
      return null
  }
}

interface ToastItemProps {
  id: string
  type: ToastType
  message: string
  description?: string
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({
  id,
  type,
  message,
  description,
  onRemove,
}) => {
  return (
    <div
      className={clsx(
        getToastStyles(type),
        'animate-in slide-in-from-top-2 fade-in duration-300'
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {getIconComponent(type)}

      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm">{message}</p>
        {description && (
          <p className="text-xs opacity-90">{description}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-inherit opacity-60 hover:opacity-100 transition-opacity p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
      role="region"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            type={toast.type}
            message={toast.message}
            description={toast.description}
            onRemove={removeToast}
          />
        </div>
      ))}
    </div>
  )
}
