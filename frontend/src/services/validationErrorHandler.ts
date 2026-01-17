import { getTranslation } from "@/i18n/i18n"
import { validationErrorConfig, extractConstraintType } from "@/config/validationErrorConfig"

/**
 * Get translated validation message based on field name and error message
 * 
 * This uses a data-driven approach:
 * 1. Extract constraint type from Pydantic error message
 * 2. Look up field config
 * 3. Find translation key for this constraint
 * 4. Fall back to generic field error if needed
 */
export function getTranslatedValidationMessage(field: string, errorMsg: string): string {
  const fieldLower = field.toLowerCase().trim()
  const constraintType = extractConstraintType(errorMsg)

  // Get field-specific config
  const fieldConfig = validationErrorConfig[fieldLower] || validationErrorConfig._default

  // Try to find translation for this constraint type
  const translationKey = fieldConfig[constraintType]

  if (translationKey) {
    return getTranslation(translationKey)
  }

  // Fallback: try generic field error
  const genericFieldKey = validationErrorConfig[fieldLower]?.string_type
  if (genericFieldKey) {
    return getTranslation(genericFieldKey)
  }

  // Last resort: return the error message as-is
  return errorMsg
}

/**
 * Map custom API error messages to translations
 */
export function getTranslatedApiMessage(detail: string): string {
  const msg = detail.toLowerCase().trim()

  // Authentication errors
  if (msg === "invalid credentials" || msg.includes("invalid credentials")) {
    return getTranslation("toasts.error.field_validation.invalid_credentials")
  }

  // Registration errors
  if (msg === "email already registered") {
    return getTranslation("toasts.error.field_validation.email_already_registered")
  }

  if (msg === "username already taken") {
    return getTranslation("toasts.error.field_validation.username_already_taken")
  }

  // Fallback
  return detail
}
