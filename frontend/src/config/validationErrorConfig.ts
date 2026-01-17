/**
 * Validation Error Configuration
 * 
 * Maps Pydantic validation constraint types to translation keys.
 * This is a data-driven approach to avoid massive if/else chains.
 * 
 * Structure:
 * {
 *   field_name: {
 *     "constraint_type": "translation.key"
 *   }
 * }
 * 
 * Constraint types match Pydantic's standard error messages:
 * - string_type: "str type expected"
 * - string_too_short: "ensure this value has at least X characters"
 * - string_too_long: "ensure this value has at most X characters"
 * - value_error: "value error"
 * - type_error: "type_error"
 * - greater_than_equal: "ensure this value is greater than or equal to X"
 * - less_than_equal: "ensure this value is less than or equal to X"
 */

export const validationErrorConfig: Record<string, Record<string, string>> = {
  // User registration & authentication
  email: {
    string_type: "toasts.error.field_errors.email",
    value_error: "toasts.error.field_validation.email_already_registered",
  },

  username: {
    string_type: "toasts.error.field_errors.username",
    string_too_short: "toasts.error.field_validation.username_min_length",
    value_error: "toasts.error.field_validation.username_already_taken",
  },

  password: {
    string_type: "toasts.error.field_errors.password",
    string_too_short: "toasts.error.field_validation.password_min_length",
  },

  // Subject fields
  name: {
    string_type: "toasts.error.field_errors.name",
    string_too_short: "toasts.error.field_validation.name_required",
    string_too_long: "toasts.error.field_validation.name_too_long",
  },

  description: {
    string_type: "toasts.error.field_errors.description",
    string_too_long: "toasts.error.field_validation.description_too_long",
  },

  // Task fields
  title: {
    string_type: "toasts.error.field_errors.title",
    string_too_short: "toasts.error.field_validation.title_required",
    string_too_long: "toasts.error.field_validation.title_too_long",
  },

  deadline: {
    type_error: "toasts.error.field_validation.deadline_required",
  },

  estimated_minutes: {
    type_error: "toasts.error.field_errors.estimated_minutes",
    less_than_equal: "toasts.error.field_validation.estimated_minutes_max",
    greater_than_equal: "toasts.error.field_validation.estimated_minutes_min",
  },

  actual_minutes: {
    type_error: "toasts.error.field_errors.actual_minutes",
    less_than_equal: "toasts.error.field_validation.actual_minutes_max",
    greater_than_equal: "toasts.error.field_validation.actual_minutes_min",
  },

  subject_id: {
    type_error: "toasts.error.field_errors.subject_id",
  },

  priority: {
    type_error: "toasts.error.field_errors.priority",
  },

  status: {
    type_error: "toasts.error.field_errors.status",
  },

  // Default fallback for unknown fields
  _default: {
    string_type: "toasts.error.field_errors.email",
    string_too_short: "toasts.error.field_validation.username_min_length",
    string_too_long: "toasts.error.field_validation.title_too_long",
    greater_than_equal: "toasts.error.field_validation.estimated_minutes_min",
    less_than_equal: "toasts.error.field_validation.estimated_minutes_max",
    type_error: "toasts.error.field_errors.email",
    value_error: "toasts.error.field_errors.email",
  },
}

/**
 * Helper function to extract constraint type from Pydantic error message
 * 
 * Maps Pydantic error messages to constraint type keys
 */
export function extractConstraintType(errorMessage: string): string {
  const msg = errorMessage.toLowerCase().trim()

  // Check for common Pydantic error patterns
  if (msg.includes("at least") && msg.includes("character")) {
    return "string_too_short"
  }
  if (msg.includes("at most") && msg.includes("character")) {
    return "string_too_long"
  }
  if (msg.includes("greater than or equal to")) {
    return "greater_than_equal"
  }
  if (msg.includes("less than or equal to")) {
    return "less_than_equal"
  }
  if (msg.includes("str type expected")) {
    return "string_type"
  }
  if (msg.includes("value error")) {
    return "value_error"
  }
  if (msg.includes("type_error")) {
    return "type_error"
  }

  // Default to the full message as fallback
  return msg
}
