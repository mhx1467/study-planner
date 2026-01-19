export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportTasksAsCSV(csvData: Blob) {
  const timestamp = new Date().toISOString().split("T")[0]
  const filename = `tasks-${timestamp}.csv`
  downloadBlob(csvData, filename)
}
