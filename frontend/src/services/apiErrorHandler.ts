import type { AxiosError } from "axios"
import { getTranslation } from "@/i18n/i18n"
import { getTranslatedValidationMessage, getTranslatedApiMessage } from "./validationErrorHandler"

/**
 * Type definitions for API errors
 */
export interface ApiErrorResponse {
  detail?: string
  message?: string
  error?: string
  [key: string]: unknown
}

// Error type constants instead of enum
export const ErrorType = {
  NETWORK: "network",
  AUTH: "auth",
  VALIDATION: "validation",
  SERVER: "server",
  NOT_FOUND: "not_found",
  UNKNOWN: "unknown",
} as const

export type ErrorTypeValue = typeof ErrorType[keyof typeof ErrorType]

/**
 * Parse error response and extract error message
 */
export function getErrorMessage(
  error: AxiosError<ApiErrorResponse>,
  defaultMessage: string
): string {
  // Check if it's a response error
  if (error.response?.data) {
    const data = error.response.data
    // Try different possible error message fields
    if (typeof data === "object" && data !== null) {
      const detail = data.detail || data.message || data.error || ""
      if (detail) {
        // Try to translate if it's a custom API error message
        const translated = getTranslatedApiMessage(String(detail))
        return translated
      }
    }
    if (typeof data === "string") {
      return getTranslatedApiMessage(data)
    }
  }

  // Network error
  if (error.code === "ERR_NETWORK" || !error.response) {
    return getTranslation("api_errors.network_error")
  }

  return defaultMessage
}

/**
 * Determine error type based on HTTP status
 */
export function getErrorType(error: AxiosError<ApiErrorResponse>): ErrorTypeValue {
  if (!error.response) {
    return ErrorType.NETWORK
  }

  const status = error.response.status

  switch (true) {
    case status === 401 || status === 403:
      return ErrorType.AUTH
    case status === 422:
      return ErrorType.VALIDATION
    case status === 404:
      return ErrorType.NOT_FOUND
    case status >= 500:
      return ErrorType.SERVER
    default:
      return ErrorType.UNKNOWN
  }
}

/**
 * Get Polish error message based on error type and status
 */
export function getTranslatedErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  const errorType = getErrorType(error)
  const status = error.response?.status
  const data = error.response?.data

  // Handle validation errors specially - extract field-specific messages
  if (errorType === ErrorType.VALIDATION && data && typeof data === "object") {
    // FastAPI validation error format with array of errors
    if (Array.isArray(data.errors)) {
      const errors = getValidationErrors(error)
      // Return first field's error message
      const firstFieldError = Object.values(errors)[0]
      if (firstFieldError) {
        return firstFieldError
      }
    }
  }

  const customMessage = getErrorMessage(error, "")

  // If there's a custom message from the API, use it
  if (customMessage) {
    return customMessage
  }

  // Otherwise, provide a default message based on error type
  switch (errorType) {
    case ErrorType.AUTH:
      return status === 401
        ? getTranslation("api_errors.auth_required")
        : getTranslation("api_errors.access_denied")

    case ErrorType.VALIDATION:
      return getTranslation("api_errors.invalid_data")

    case ErrorType.NOT_FOUND:
      return getTranslation("api_errors.resource_not_found")

    case ErrorType.SERVER:
      return status === 503
        ? getTranslation("api_errors.service_unavailable")
        : getTranslation("api_errors.generic_server_error")

    case ErrorType.NETWORK:
      return getTranslation("api_errors.connection_error")

    case ErrorType.UNKNOWN:
    default:
      return getTranslation("api_errors.unknown_error")
  }
}

/**
 * Extract validation errors from API response
 * Returns an object mapping field names to error messages
 */
export function getValidationErrors(
   error: AxiosError<ApiErrorResponse>
 ): Record<string, string> {
   const data = error.response?.data

   if (!data || typeof data !== "object") {
     return {}
   }

  if (Array.isArray((data).errors)) {
    const errors: Record<string, string> = {}
    data.errors.forEach((err) => {
      if (err.loc && err.msg) {
        const field = err.loc[1] || "general"
        // Use translation for validation error
        const translatedMsg = getTranslatedValidationMessage(field, err.msg)
        errors[field] = translatedMsg
      }
    })
    return errors
  }

  return {}
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AxiosError<ApiErrorResponse>): boolean {
  if (!error.response) {
    return true // Network errors are retryable
  }

  const status = error.response.status

  // Retry on 5xx errors, 429 (rate limit), or 503 (service unavailable)
  return status === 429 || status === 503 || status >= 500
}

/**
 * Check if error requires re-authentication
 */
export function isAuthError(error: AxiosError<ApiErrorResponse>): boolean {
  return error.response?.status === 401 || error.response?.status === 403
}
