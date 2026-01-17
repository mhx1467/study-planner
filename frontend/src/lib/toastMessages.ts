import { getTranslation, formatTranslation } from "@/i18n/i18n"

export const toastMessages = {
  success: {
    loginSuccess: {
      get title() {
        return getTranslation("toasts.success.login.title")
      },
      get description() {
        return getTranslation("toasts.success.login.description")
      },
    },
    registerSuccess: {
      get title() {
        return getTranslation("toasts.success.register.title")
      },
      get description() {
        return getTranslation("toasts.success.register.description")
      },
    },
    subjectCreated: {
      get title() {
        return getTranslation("toasts.success.subject_created.title")
      },
      get description() {
        return getTranslation("toasts.success.subject_created.description")
      },
    },
    subjectUpdated: {
      get title() {
        return getTranslation("toasts.success.subject_updated.title")
      },
      get description() {
        return getTranslation("toasts.success.subject_updated.description")
      },
    },
    subjectDeleted: {
      get title() {
        return getTranslation("toasts.success.subject_deleted.title")
      },
      get description() {
        return getTranslation("toasts.success.subject_deleted.description")
      },
    },
    taskCreated: {
      get title() {
        return getTranslation("toasts.success.task_created.title")
      },
      get description() {
        return getTranslation("toasts.success.task_created.description")
      },
    },
    taskUpdated: {
      get title() {
        return getTranslation("toasts.success.task_updated.title")
      },
      get description() {
        return getTranslation("toasts.success.task_updated.description")
      },
    },
    taskDeleted: {
      get title() {
        return getTranslation("toasts.success.task_deleted.title")
      },
      get description() {
        return getTranslation("toasts.success.task_deleted.description")
      },
    },
    taskStatusChanged: {
      get title() {
        return getTranslation("toasts.success.status_changed.title")
      },
      get description() {
        return getTranslation("toasts.success.status_changed.description")
      },
    },
    scheduleCreated: {
      get title() {
        return getTranslation("toasts.success.schedule_created.title")
      },
      get description() {
        return getTranslation("toasts.success.schedule_created.description")
      },
    },
    scheduleUpdated: {
      get title() {
        return getTranslation("toasts.success.schedule_updated.title")
      },
      get description() {
        return getTranslation("toasts.success.schedule_updated.description")
      },
    },
    scheduleDeleted: {
      get title() {
        return getTranslation("toasts.success.schedule_deleted.title")
      },
      get description() {
        return getTranslation("toasts.success.schedule_deleted.description")
      },
    },
    dataSaved: {
      get title() {
        return getTranslation("toasts.success.data_saved.title")
      },
      get description() {
        return getTranslation("toasts.success.data_saved.description")
      },
    },
    dataExported: {
      get title() {
        return getTranslation("toasts.success.data_exported.title")
      },
      get description() {
        return getTranslation("toasts.success.data_exported.description")
      },
    },
    passwordChanged: {
      get title() {
        return getTranslation("toasts.success.password_changed.title")
      },
      get description() {
        return getTranslation("toasts.success.password_changed.description")
      },
    },
    logoutSuccess: {
      get title() {
        return getTranslation("toasts.success.logout.title")
      },
      get description() {
        return getTranslation("toasts.success.logout.description")
      },
    },
  },

  error: {
    loginFailed: {
      get title() {
        return getTranslation("toasts.error.login_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.login_failed.description")
      },
    },
    invalidCredentials: {
      get title() {
        return getTranslation("toasts.error.invalid_credentials.title")
      },
      get description() {
        return getTranslation("toasts.error.invalid_credentials.description")
      },
    },
    userNotFound: {
      get title() {
        return getTranslation("toasts.error.user_not_found.title")
      },
      get description() {
        return getTranslation("toasts.error.user_not_found.description")
      },
    },
    emailTaken: {
      get title() {
        return getTranslation("toasts.error.email_taken.title")
      },
      get description() {
        return getTranslation("toasts.error.email_taken.description")
      },
    },
    usernameTaken: {
      get title() {
        return getTranslation("toasts.error.username_taken.title")
      },
      get description() {
        return getTranslation("toasts.error.username_taken.description")
      },
    },
    registrationFailed: {
      get title() {
        return getTranslation("toasts.error.register_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.register_failed.description")
      },
    },
    subjectCreationFailed: {
      get title() {
        return getTranslation("toasts.error.subject_creation_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.subject_creation_failed.description")
      },
    },
    subjectUpdateFailed: {
      get title() {
        return getTranslation("toasts.error.subject_update_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.subject_update_failed.description")
      },
    },
    subjectDeletionFailed: {
      get title() {
        return getTranslation("toasts.error.subject_deletion_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.subject_deletion_failed.description")
      },
    },
    taskCreationFailed: {
      get title() {
        return getTranslation("toasts.error.task_creation_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.task_creation_failed.description")
      },
    },
    taskUpdateFailed: {
      get title() {
        return getTranslation("toasts.error.task_update_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.task_update_failed.description")
      },
    },
    taskDeletionFailed: {
      get title() {
        return getTranslation("toasts.error.task_deletion_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.task_deletion_failed.description")
      },
    },
    scheduleCreationFailed: {
      get title() {
        return getTranslation("toasts.error.schedule_creation_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.schedule_creation_failed.description")
      },
    },
    scheduleUpdateFailed: {
      get title() {
        return getTranslation("toasts.error.schedule_update_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.schedule_update_failed.description")
      },
    },
    scheduleDeletionFailed: {
      get title() {
        return getTranslation("toasts.error.schedule_deletion_failed.title")
      },
      get description() {
        return getTranslation("toasts.error.schedule_deletion_failed.description")
      },
    },
    networkError: {
      get title() {
        return getTranslation("toasts.error.network_error.title")
      },
      get description() {
        return getTranslation("toasts.error.network_error.description")
      },
    },
    serverError: {
      get title() {
        return getTranslation("toasts.error.server_error.title")
      },
      get description() {
        return getTranslation("toasts.error.server_error.description")
      },
    },
    unauthorized: {
      get title() {
        return getTranslation("toasts.error.unauthorized.title")
      },
      get description() {
        return getTranslation("toasts.error.unauthorized.description")
      },
    },
    notFound: {
      get title() {
        return getTranslation("toasts.error.not_found.title")
      },
      get description() {
        return getTranslation("toasts.error.not_found.description")
      },
    },
    validationError: {
      get title() {
        return getTranslation("toasts.error.validation_error.title")
      },
      get description() {
        return getTranslation("toasts.error.validation_error.description")
      },
    },
    requiredField: {
      get title() {
        return getTranslation("toasts.error.required_field.title")
      },
      get description() {
        return getTranslation("toasts.error.required_field.description")
      },
    },
    invalidEmail: {
      get title() {
        return getTranslation("toasts.error.invalid_email.title")
      },
      get description() {
        return getTranslation("toasts.error.invalid_email.description")
      },
    },
    passwordTooShort: {
      get title() {
        return getTranslation("toasts.error.password_too_short.title")
      },
      get description() {
        return getTranslation("toasts.error.password_too_short.description")
      },
    },
    somethingWentWrong: {
      get title() {
        return getTranslation("toasts.error.unknown_error.title")
      },
      get description() {
        return getTranslation("toasts.error.unknown_error.description")
      },
    },
  },

  warning: {
    unsavedChanges: {
      get title() {
        return getTranslation("toasts.warning.unsaved_changes.title")
      },
      get description() {
        return getTranslation("toasts.warning.unsaved_changes.description")
      },
    },
    deleteConfirmation: {
      get title() {
        return getTranslation("toasts.warning.confirm_delete.title")
      },
      get description() {
        return getTranslation("toasts.warning.confirm_delete.description")
      },
    },
    sessionExpiring: {
      get title() {
        return getTranslation("toasts.warning.session_expiring.title")
      },
      get description() {
        return getTranslation("toasts.warning.session_expiring.description")
      },
    },
    lowStorage: {
      get title() {
        return getTranslation("toasts.warning.low_storage.title")
      },
      get description() {
        return getTranslation("toasts.warning.low_storage.description")
      },
    },
    taskDeadlineApproaching: {
      get title() {
        return getTranslation("toasts.warning.approaching_deadline.title")
      },
      get description() {
        return getTranslation("toasts.warning.approaching_deadline.description")
      },
    },
    noTasksScheduled: {
      get title() {
        return getTranslation("toasts.warning.no_scheduled_tasks.title")
      },
      get description() {
        return getTranslation("toasts.warning.no_scheduled_tasks.description")
      },
    },
    highWorkload: {
      get title() {
        return getTranslation("toasts.warning.high_workload.title")
      },
      get description() {
        return getTranslation("toasts.warning.high_workload.description")
      },
    },
  },

  info: {
    welcome: {
      get title() {
        return getTranslation("toasts.info.welcome.title")
      },
      get description() {
        return getTranslation("toasts.info.welcome.description")
      },
    },
    dataLoading: {
      get title() {
        return getTranslation("toasts.info.loading_data.title")
      },
      get description() {
        return getTranslation("toasts.info.loading_data.description")
      },
    },
    processingRequest: {
      get title() {
        return getTranslation("toasts.info.processing.title")
      },
      get description() {
        return getTranslation("toasts.info.processing.description")
      },
    },
    noData: {
      get title() {
        return getTranslation("toasts.info.no_data.title")
      },
      get description() {
        return getTranslation("toasts.info.no_data.description")
      },
    },
    emptyList: {
      get title() {
        return getTranslation("toasts.info.empty_list.title")
      },
      get description() {
        return getTranslation("toasts.info.empty_list.description")
      },
    },
    filterApplied: {
      get title() {
        return getTranslation("toasts.info.filter_applied.title")
      },
      get description() {
        return getTranslation("toasts.info.filter_applied.description")
      },
    },
    sortApplied: {
      get title() {
        return getTranslation("toasts.info.sort_applied.title")
      },
      get description() {
        return getTranslation("toasts.info.sort_applied.description")
      },
    },
    searchResults: (count: number) => ({
      get title() {
        return getTranslation("toasts.info.search_results.title")
      },
      get description() {
        return formatTranslation("toasts.info.search_results.description", { count })
      },
    }),
  },
}

export type ToastMessageKey = keyof typeof toastMessages
