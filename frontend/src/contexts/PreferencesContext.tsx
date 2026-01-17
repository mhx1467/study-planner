import React, { createContext, useContext, useState } from 'react'

export type TaskViewMode = 'list' | 'kanban'
export type ScheduleHoursScheme = 'business' | 'all'

export interface Preferences {
  taskViewMode: TaskViewMode
  scheduleHoursScheme: ScheduleHoursScheme
}

interface PreferencesContextType {
  preferences: Preferences
  setTaskViewMode: (viewMode: TaskViewMode) => void
  setScheduleHoursScheme: (scheme: ScheduleHoursScheme) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

const PREFERENCES_STORAGE_KEY = 'app_preferences'

const DEFAULT_PREFERENCES: Preferences = {
  taskViewMode: 'list',
  scheduleHoursScheme: 'business',
}

function loadPreferences(): Preferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        taskViewMode: isValidTaskViewMode(parsed.taskViewMode) ? parsed.taskViewMode : DEFAULT_PREFERENCES.taskViewMode,
        scheduleHoursScheme: isValidScheduleHoursScheme(parsed.scheduleHoursScheme) ? parsed.scheduleHoursScheme : DEFAULT_PREFERENCES.scheduleHoursScheme,
      }
    }
  } catch {
    console.warn('Failed to load preferences from localStorage')
  }

  return DEFAULT_PREFERENCES
}

function isValidTaskViewMode(value: unknown): value is TaskViewMode {
  return value === 'list' || value === 'kanban'
}

function isValidScheduleHoursScheme(value: unknown): value is ScheduleHoursScheme {
  return value === 'business' || value === 'all'
}

function savePreferences(preferences: Preferences): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    console.warn('Failed to save preferences to localStorage')
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<Preferences>(loadPreferences)

  const setTaskViewMode = (viewMode: TaskViewMode) => {
    const newPreferences = { ...preferences, taskViewMode: viewMode }
    setPreferencesState(newPreferences)
    savePreferences(newPreferences)
  }

  const setScheduleHoursScheme = (scheme: ScheduleHoursScheme) => {
    const newPreferences = { ...preferences, scheduleHoursScheme: scheme }
    setPreferencesState(newPreferences)
    savePreferences(newPreferences)
  }

  return (
    <PreferencesContext.Provider value={{ preferences, setTaskViewMode, setScheduleHoursScheme }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
