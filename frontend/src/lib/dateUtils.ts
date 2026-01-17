/**
 * Calculate the number of days until a due date
 * @param dueDate - ISO string date
 * @returns Number of days until due date (negative if overdue)
 */
export const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - today.getTime()
  const days = Math.ceil(diff / (1000 * 3600 * 24))
  return days
}
