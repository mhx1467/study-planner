import type { AxiosError } from "axios"
import { api } from "./api"
import type { ToastContextType } from "@/contexts/ToastContext"
import {
  getErrorType,
  getTranslatedErrorMessage,
  isAuthError,
  ErrorType,
  type ApiErrorResponse,
} from "./apiErrorHandler"
import { getTranslation } from "@/i18n/i18n"

let responseInterceptorId: number | null = null

export function setupApiErrorInterceptor(toast: ToastContextType) {
  if (responseInterceptorId !== null) {
    api.interceptors.response.eject(responseInterceptorId)
  }

  responseInterceptorId = api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const typedError = error as AxiosError<ApiErrorResponse>

      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register")

      if (!isAuthError(typedError) || !isAuthEndpoint) {
        const message = getTranslatedErrorMessage(typedError)
        const errorType = getErrorType(typedError)

        if (isAuthError(typedError)) {
          toast.showError(getTranslation("api_errors.authorization_error"), message, 7000)
        } else if (errorType === ErrorType.VALIDATION) {
          toast.showWarning(getTranslation("toasts.error.validation_error.title"), message, 6000)
        } else if (errorType === ErrorType.NOT_FOUND) {
          toast.showInfo(getTranslation("common.info"), message, 5000)
        } else if (errorType === ErrorType.SERVER || errorType === ErrorType.NETWORK) {
          toast.showError(getTranslation("api_errors.server_error"), message, 7000)
        } else {
          toast.showError(getTranslation("common.error"), message, 7000)
        }
      }

      // Handle 401 auth errors - but NOT on login/register pages
      // (those are expected to fail with 401 for wrong credentials)
      if (error.response?.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem("access_token")
        window.location.href = "/login"
      }

      return Promise.reject(error)
    }
  )

  // Return cleanup function to eject the interceptor if needed
  return () => {
    if (responseInterceptorId !== null) {
      api.interceptors.response.eject(responseInterceptorId)
      responseInterceptorId = null
    }
  }
}
