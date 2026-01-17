import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  BookMarked,
  LayoutGrid,
  List,
} from "lucide-react"
import { useCreateTask, useUpdateTask, useDeleteTask, useTasks, useSubjects } from "@/hooks/useApi"
import { useToast } from "@/contexts/ToastContext"
import { useTranslation } from "@/hooks/useTranslation"
import { usePreferences } from "@/contexts/PreferencesContext"
import { getDaysUntilDue } from "@/lib/dateUtils"

interface Subject {
  id: number
  name: string
  description: string
}

interface Task {
  id: number
  title: string
  description: string
  subject_id?: number | null
  subject_name?: string
  priority: "low" | "medium" | "high"
  deadline?: string
  due_date?: string
  completed?: boolean
  status?: string
  estimated_minutes?: number
  actual_minutes?: number
}

export function TasksPage() {
  const { data: tasks = [], isLoading: isLoadingTasks, refetch } = useTasks()
  const { data: subjects = [] } = useSubjects()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
   const { showSuccess } = useToast()
   const { t, tf } = useTranslation()
   const { preferences } = usePreferences()
   const subjectDropdownRef = useRef<HTMLDivElement>(null)

  // View mode state
   const [viewMode, setViewMode] = useState<"list" | "kanban">(preferences.taskViewMode)

  // Error and form state
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Filter and sorting state
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [subjectSearch, setSubjectSearch] = useState("")
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)

  // Completion dialog state
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null)
  const [actualMinutes, setActualMinutes] = useState("")

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)
  const [draggedFromStatus, setDraggedFromStatus] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: null as number | null,
    subject_name: "",
    priority: "medium" as "low" | "medium" | "high",
    due_date: "",
    estimated_minutes: 30,
  })

   // Close dropdown when clicking outside
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
         setShowSubjectDropdown(false)
       }
     }

     document.addEventListener("mousedown", handleClickOutside)
     return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     const { name, value } = e.target
     setFormData((prev) => ({
       ...prev,
       [name]: name === "estimated_minutes" ? parseInt(value) || 0 : value,
     }))
   }

  const handleSubjectSelect = (subject: Subject) => {
    setFormData((prev) => ({
      ...prev,
      subject_id: subject.id,
      subject_name: subject.name,
    }))
    setSubjectSearch("")
    setShowSubjectDropdown(false)
  }

  const handleClearSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subject_id: null,
      subject_name: "",
    }))
    setSubjectSearch("")
  }

   const filteredSubjects = subjects.filter((subject: Subject) =>
     subject.name.toLowerCase().includes(subjectSearch.toLowerCase())
   )

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.title.trim()) {
          setError(t("forms.task_title_required"))
          return
        }

        if (!formData.due_date) {
          setError(t("forms.due_date_required"))
          return
        }

        if (!formData.estimated_minutes || formData.estimated_minutes < 15) {
          setError(t("forms.estimated_time_min"))
          return
        }

        try {
          if (editingId) {
            await updateTask.mutateAsync({
              id: editingId,
              title: formData.title,
              description: formData.description,
              subject_id: formData.subject_id || undefined,
              priority: formData.priority,
              deadline: new Date(formData.due_date).toISOString(),
              estimated_minutes: formData.estimated_minutes,
            })
            showSuccess(t("pages.task_updated_title"), t("pages.task_updated_message"))
          } else {
            await createTask.mutateAsync({
              title: formData.title,
              description: formData.description,
              subject_id: formData.subject_id || undefined,
              priority: formData.priority,
              deadline: new Date(formData.due_date).toISOString(),
              estimated_minutes: formData.estimated_minutes,
            })
             showSuccess(t("pages.task_added_title"), tf("pages.task_added", { title: formData.title }))
          }
          setFormData({
            title: "",
            description: "",
            subject_id: null,
            subject_name: "",
            priority: "medium",
            due_date: "",
            estimated_minutes: 30,
          })
          setEditingId(null)
          setShowForm(false)
          refetch()
         } catch {
           // error is already handled by the API interceptor with translations
           // just keep the form visible for user to retry
         }
      }

    const handleEdit = (task: Task) => {
      const dateStr = task.deadline || task.due_date || ""
      setFormData({
        title: task.title,
        description: task.description,
        subject_id: task.subject_id || null,
        subject_name: task.subject_name || "",
        priority: task.priority,
        due_date: dateStr ? dateStr.split("T")[0] : "",
        estimated_minutes: task.estimated_minutes || 30,
      })
      setEditingId(task.id)
      setShowForm(true)
    }

       const handleDelete = async (id: number) => {
         setDeletingTaskId(id)
         setShowDeleteDialog(true)
       }

       const handleConfirmDelete = async () => {
         if (deletingTaskId === null) return
         try {
           await deleteTask.mutateAsync(deletingTaskId)
           showSuccess(t("pages.task_deleted_title"), t("pages.task_deleted_message"))
           refetch()
         } catch {
           // error is already handled by the API interceptor with translations
         } finally {
           setShowDeleteDialog(false)
           setDeletingTaskId(null)
         }
       }

    const handleCancel = () => {
      setFormData({
        title: "",
        description: "",
        subject_id: null,
        subject_name: "",
        priority: "medium",
        due_date: "",
        estimated_minutes: 30,
      })
      setSubjectSearch("")
      setShowSubjectDropdown(false)
      setEditingId(null)
      setShowForm(false)
      setError("")
    }

  const handleToggleComplete = (task: Task) => {
    if (task.status === "done") {
      handleConfirmCompletion(task.id, 0, true)
    } else {
      setCompletingTaskId(task.id)
      setActualMinutes("")
      setShowCompletionDialog(true)
    }
  }

    const handleConfirmCompletion = async (taskId: number, minutes: number, toggleBack = false) => {
      try {
        const task = tasks.find((t: Task) => t.id === taskId)
        if (!task) return

        const dateStr = task.deadline || task.due_date || new Date().toISOString()
        await updateTask.mutateAsync({
          id: taskId,
          title: task.title,
          description: task.description,
          subject_id: task.subject_id || undefined,
          priority: task.priority,
          deadline: dateStr.includes("T") ? dateStr : new Date(dateStr).toISOString(),
          estimated_minutes: task.estimated_minutes || 30,
          actual_minutes: toggleBack ? undefined : minutes,
          status: toggleBack ? "todo" : "done",
        })

        if (toggleBack) {
          showSuccess(t("pages.status_changed_title"), t("pages.task_back_to_todo"))
        } else {
          showSuccess(t("pages.task_completed_title"), tf("pages.task_completed", { title: task.title }))
        }

        refetch()
        setShowCompletionDialog(false)
        setCompletingTaskId(null)
        setActualMinutes("")
       } catch {
         // Error is already handled and displayed by the API interceptor with translations
         // Just close the dialog and keep the form state for user to retry
         setShowCompletionDialog(false)
       }
    }

    const filteredTasks = filterPriority === "all"
     ? tasks
     : tasks.filter((t: Task) => t.priority === filterPriority)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive bg-destructive/10"
      case "medium":
        return "text-secondary bg-secondary/10"
      case "low":
        return "text-sky-blue-600 bg-sky-blue/10"
      default:
        return ""
    }
  }


  // Get tasks by status for kanban view
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((t: Task) => t.status === status)
  }

  // Kanban column data
  const kanbanColumns = [
    { status: "todo", title: t("pages.tasks.kanban_status_todo"), color: "bg-slate-50 border-slate-200" },
    { status: "in_progress", title: t("pages.tasks.kanban_status_in_progress"), color: "bg-blue-50 border-blue-200" },
    { status: "done", title: t("pages.tasks.kanban_status_done"), color: "bg-green-50 border-green-200" },
  ]

  // Drag and drop handlers
  const handleDragStart = (taskId: number, status: string) => {
    setDraggedTaskId(taskId)
    setDraggedFromStatus(status)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
      e.preventDefault()
      
      if (draggedTaskId === null || draggedFromStatus === null) return
      if (newStatus === draggedFromStatus) {
        setDraggedTaskId(null)
        setDraggedFromStatus(null)
        return
      }

      const task = tasks.find((t: Task) => t.id === draggedTaskId)
      if (!task) return

      // If moving to done status, show completion dialog instead of directly updating
      if (newStatus === "done" && draggedFromStatus !== "done") {
        setCompletingTaskId(draggedTaskId)
        setShowCompletionDialog(true)
        setDraggedTaskId(null)
        setDraggedFromStatus(null)
        return
      }

      try {
        const dateStr = task.deadline || task.due_date || new Date().toISOString()
        await updateTask.mutateAsync({
          id: draggedTaskId,
          title: task.title,
          description: task.description,
          subject_id: task.subject_id || undefined,
          priority: task.priority,
          deadline: dateStr.includes("T") ? dateStr : new Date(dateStr).toISOString(),
          estimated_minutes: task.estimated_minutes || 30,
          actual_minutes: task.actual_minutes,
          status: newStatus,
        })

        // Show toast based on the new status
        const statusMessages: Record<string, string> = {
          "todo": t("pages.task_moved_to_todo"),
          "in_progress": t("pages.task_moved_to_in_progress"),
          "done": t("pages.task_marked_done")
        }

        showSuccess(t("pages.status_changed_title"), statusMessages[newStatus] || t("pages.status_changed"))
        refetch()
        } catch {
          // Error is already handled by the API interceptor with translations
        }

      setDraggedTaskId(null)
      setDraggedFromStatus(null)
    }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDraggedFromStatus(null)
  }

     return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {isLoadingTasks && (
           <Card className="mb-8 border-slate-300">
             <CardContent className="pt-6">
               <p className="text-center text-muted-foreground">{t("pages.loading_tasks")}</p>
             </CardContent>
           </Card>
         )}

         <div className="mb-8 flex justify-between items-start">
           <div>
             <h1 className="text-4xl font-bold text-primary">
               {t("pages.tasks")}
             </h1>
             <p className="text-muted-foreground mt-2 text-lg">
               {t("pages.tasks_description")}
             </p>
           </div>
           <div className="flex gap-2">
             {!showForm && (
               <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
                 <Plus className="h-4 w-4" />
                 {t("buttons.new_task")}
               </Button>
             )}
           </div>
         </div>

        {showForm && (
          <Card className="mb-8 border-slate-300">
            <CardHeader>
              <CardTitle>{editingId ? t("pages.edit_task") : t("pages.create_task")}</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-primary">
                      {t("forms.task_title")} *
                    </label>
                    <Input
                      id="title"
                      name="title"
                       placeholder={t("forms.task_title_placeholder")}
                       value={formData.title}
                       onChange={handleChange}
                       disabled={createTask.isPending || updateTask.isPending}
                     />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="due_date" className="text-sm font-medium text-primary">
                      {t("forms.due_date")} *
                    </label>
                     <Input
                       id="due_date"
                       name="due_date"
                       type="date"
                       value={formData.due_date}
                       onChange={handleChange}
                       disabled={createTask.isPending || updateTask.isPending}
                     />
                  </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label htmlFor="subject_search" className="text-sm font-medium text-primary">
                       {t("forms.subject")}
                     </label>
                     <div className="relative" ref={subjectDropdownRef}>
                       <div className="flex gap-2">
                         <div className="flex-1 relative">
                            <Input
                              id="subject_search"
                              placeholder={t("forms.search_subject")}
                              value={subjectSearch || formData.subject_name}
                              onChange={(e) => {
                                setSubjectSearch(e.target.value)
                                setShowSubjectDropdown(true)
                              }}
                              onFocus={() => setShowSubjectDropdown(true)}
                              disabled={createTask.isPending || updateTask.isPending}
                              className="bg-background"
                            />
                            {showSubjectDropdown && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                                {filteredSubjects.length === 0 ? (
                                  <div className="p-3 text-sm text-muted-foreground text-center">
                                    {subjects.length === 0
                                      ? t("pages.no_subjects_created")
                                      : t("pages.no_matching_subjects")}
                                  </div>
                                ) : (
                                   filteredSubjects.map((subject: Subject) => (
                                    <button
                                      key={subject.id}
                                      type="button"
                                      onClick={() => handleSubjectSelect(subject)}
                                      className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors text-sm text-foreground"
                                    >
                                      <div className="font-medium text-foreground">{subject.name}</div>
                                      {subject.description && (
                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                          {subject.description}
                                        </div>
                                      )}
                                    </button>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                          {formData.subject_name && (
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={handleClearSubject}
                               disabled={createTask.isPending || updateTask.isPending}
                               className="px-2"
                             >
                               ✕
                             </Button>
                          )}
                        </div>
                        {formData.subject_name && (
                          <div className="mt-2 p-2 bg-primary/5 border border-slate-300 rounded text-sm text-primary">
                            {t("pages.selected")}: {formData.subject_name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="priority" className="text-sm font-medium text-primary">
                        {t("forms.priority")}
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={createTask.isPending || updateTask.isPending}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      >
                        <option value="low">{t("common.low_priority")}</option>
                        <option value="medium">{t("common.medium_priority")}</option>
                        <option value="high">{t("common.high_priority")}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="estimated_minutes" className="text-sm font-medium text-primary">
                        {t("forms.estimated_time")} *
                      </label>
                      <Input
                        id="estimated_minutes"
                        name="estimated_minutes"
                        type="number"
                        min="15"
                        max="480"
                        step="15"
                        value={formData.estimated_minutes}
                        onChange={handleChange}
                        disabled={createTask.isPending || updateTask.isPending}
                        placeholder="np. 30"
                      />
                      <p className="text-xs text-muted-foreground">{t("forms.time_range")}</p>
                    </div>
                  </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-primary">
                    {t("forms.description")}
                  </label>
                   <textarea
                     id="description"
                     name="description"
                     placeholder={t("forms.task_description_placeholder")}
                     value={formData.description}
                     onChange={handleChange}
                     disabled={createTask.isPending || updateTask.isPending}
                     className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                     rows={3}
                   />
                </div>

                 <div className="flex gap-2 justify-end">
                   <Button type="button" variant="outline" onClick={handleCancel} disabled={createTask.isPending || updateTask.isPending}>
                     {t("buttons.cancel")}
                   </Button>
                   <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
                     {createTask.isPending || updateTask.isPending ? (editingId ? t("buttons.updating") : t("buttons.creating")) : (editingId ? t("buttons.update_task") : t("buttons.create_task"))}
                   </Button>
                 </div>
              </form>
            </CardContent>
           </Card>
         )}

         <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>{t("dialogs.complete_task")}</DialogTitle>
               <DialogDescription>
                 {t("dialogs.complete_task_description")}
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <label htmlFor="actual_minutes" className="text-sm font-medium text-primary">
                   {t("forms.actual_time")} *
                 </label>
                 <Input
                   id="actual_minutes"
                   type="number"
                   min="0"
                   max="480"
                   step="5"
                   placeholder="np. 45"
                   value={actualMinutes}
                   onChange={(e) => setActualMinutes(e.target.value)}
                   disabled={updateTask.isPending}
                 />
               </div>
             </div>
             <DialogFooter>
               <Button
                 variant="outline"
                 onClick={() => setShowCompletionDialog(false)}
                 disabled={updateTask.isPending}
               >
                 {t("buttons.cancel")}
               </Button>
               <Button
                 onClick={() => {
                   const minutes = parseInt(actualMinutes) || 0
                   handleConfirmCompletion(completingTaskId || 0, minutes)
                 }}
                 disabled={updateTask.isPending || !actualMinutes}
               >
                 {updateTask.isPending ? t("buttons.saving") : t("buttons.confirm")}
               </Button>
             </DialogFooter>
           </DialogContent>
          </Dialog>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("dialogs.confirm_delete_title")}</DialogTitle>
                <DialogDescription>
                  {t("dialogs.confirm_delete_task")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleteTask.isPending}
                >
                  {t("buttons.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={deleteTask.isPending}
                >
                  {deleteTask.isPending ? t("buttons.saving") : t("buttons.delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

         {tasks.length > 0 && (
           <div className="mb-6 space-y-4">
             <div className="flex gap-2">
               <Button
                 variant={viewMode === "list" ? "default" : "outline"}
                 onClick={() => setViewMode("list")}
                 size="sm"
                 className="gap-2"
               >
                 <List className="h-4 w-4" />
                 {t("pages.list_view")}
               </Button>
               <Button
                 variant={viewMode === "kanban" ? "default" : "outline"}
                 onClick={() => setViewMode("kanban")}
                 size="sm"
                 className="gap-2"
               >
                 <LayoutGrid className="h-4 w-4" />
                 {t("pages.kanban_view")}
               </Button>
             </div>

             <div className="flex gap-2 flex-wrap">
               <Button
                 variant={filterPriority === "all" ? "default" : "outline"}
                 onClick={() => setFilterPriority("all")}
                 size="sm"
               >
                 {t("pages.all_tasks")} ({tasks.length})
               </Button>
               <Button
                 variant={filterPriority === "high" ? "default" : "outline"}
                 onClick={() => setFilterPriority("high")}
                 size="sm"
               >
                 {t("pages.high_priority_tasks")} ({tasks.filter((t: Task) => t.priority === "high").length})
               </Button>
               <Button
                 variant={filterPriority === "medium" ? "default" : "outline"}
                 onClick={() => setFilterPriority("medium")}
                 size="sm"
               >
                 {t("pages.medium_priority_tasks")} ({tasks.filter((t: Task) => t.priority === "medium").length})
               </Button>
               <Button
                 variant={filterPriority === "low" ? "default" : "outline"}
                 onClick={() => setFilterPriority("low")}
                 size="sm"
               >
                 {t("pages.low_priority_tasks")} ({tasks.filter((t: Task) => t.priority === "low").length})
               </Button>
             </div>
           </div>
         )}

         {filteredTasks.length === 0 ? (
           <Card className="text-center py-12 border-slate-300">
             <CardContent>
               <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-lg font-medium text-foreground mb-2">
                 {tasks.length === 0 ? t("pages.no_tasks") : t("pages.no_matching_tasks")}
               </h3>
               <p className="text-muted-foreground mb-6">
                 {tasks.length === 0
                   ? t("pages.no_tasks_description")
                   : t("pages.no_matching_tasks_description")}
               </p>
               {tasks.length === 0 && (
                 <Button onClick={() => setShowForm(true)}>
                   <Plus className="h-4 w-4 mr-2" />
                   {t("buttons.create_first_task")}
                 </Button>
               )}
             </CardContent>
           </Card>
         ) : viewMode === "list" ? (
           // LIST VIEW
           <div className="space-y-3">
             {filteredTasks
               .sort((a: Task, b: Task) => {
                 const dateA = new Date(a.deadline || a.due_date || 0).getTime()
                 const dateB = new Date(b.deadline || b.due_date || 0).getTime()
                 return dateA - dateB
               })
               .map((task: Task) => (
                 <Card
                   key={task.id}
                   className={`border-l-4 hover:shadow-lg transition-all cursor-pointer ${
                     task.status === "done"
                       ? "border-l-muted opacity-60"
                       : task.priority === "high"
                         ? "border-l-destructive"
                         : task.priority === "medium"
                           ? "border-l-secondary"
                           : "border-l-sky-blue"
                   }`}
                 >
                   <CardContent className="pt-6 flex items-start justify-between gap-4">
                     <div className="flex items-start gap-4 flex-1">
                       <button
                         onClick={() => handleToggleComplete(task)}
                         className="mt-1 flex-shrink-0 transition-colors"
                       >
                         {task.status === "done" ? (
                           <CheckCircle2 className="h-5 w-5 text-primary" />
                         ) : (
                           <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                         )}
                       </button>
                       <div className="flex-1 min-w-0">
                         <h3
                           className={`font-medium text-foreground ${
                             task.status === "done" ? "line-through text-muted-foreground" : ""
                           }`}
                         >
                           {task.title}
                         </h3>
                         {task.description && (
                           <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                             {task.description}
                           </p>
                         )}
                         <div className="flex gap-3 mt-2 flex-wrap">
                           {task.subject_name && (
                             <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                               {task.subject_name}
                             </span>
                           )}
                           <span
                             className={`text-xs px-2 py-1 rounded capitalize font-medium ${getPriorityColor(
                               task.priority
                             )}`}
                           >
                             {task.priority === "high" ? t("common.high_priority") : task.priority === "medium" ? t("common.medium_priority") : t("common.low_priority")}
                           </span>
                           <span className="text-xs text-muted-foreground">
                             {t("pages.due_in")} {getDaysUntilDue(task.deadline || task.due_date || new Date().toISOString())}
                           </span>
                           {task.estimated_minutes && (
                             <span className="text-xs text-muted-foreground">
                               ~{task.estimated_minutes}min
                             </span>
                           )}
                           {task.actual_minutes && (
                             <span className="text-xs text-primary font-medium">
                               {task.actual_minutes}min {t("pages.spent")}
                             </span>
                           )}
                         </div>
                       </div>
                     </div>

                     <div className="flex gap-2 flex-shrink-0">
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleEdit(task)}
                         className="h-8 w-8 hover:text-primary"
                       >
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleDelete(task.id)}
                         className="h-8 w-8 hover:text-destructive"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
           </div>
         ) : (
           // KANBAN VIEW
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {kanbanColumns.map((column) => {
               const columnTasks = getTasksByStatus(column.status)
               return (
                 <div
                   key={column.status}
                   className={`border border-slate-200 rounded-lg p-4 ${column.color} min-h-96 ${
                     draggedFromStatus === column.status ? "opacity-50" : ""
                   }`}
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, column.status)}
                 >
                   <div className="mb-4 pb-4 border-b border-slate-300">
                     <h2 className="font-semibold text-foreground">{column.title}</h2>
                     <p className="text-xs text-muted-foreground mt-1">
                       {columnTasks.length} {columnTasks.length === 1 ? t("pages.task_singular") : t("pages.tasks_plural")}
                     </p>
                   </div>
                   <div className="space-y-3">
                     {columnTasks.length === 0 ? (
                       <div className="text-center py-8">
                         <p className="text-sm text-muted-foreground">{t("pages.no_tasks")}</p>
                       </div>
                     ) : (
                       columnTasks.map((task: Task) => (
                         <Card
                           key={task.id}
                           draggable
                           onDragStart={() => handleDragStart(task.id, task.status || "todo")}
                           onDragEnd={handleDragEnd}
                           className={`hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                             draggedTaskId === task.id ? "opacity-50" : ""
                           }`}
                         >
                           <CardContent className="pt-4 pb-4">
                             <div className="flex items-start gap-2 mb-2">
                               <button
                                 onClick={() => handleToggleComplete(task)}
                                 className="mt-0.5 flex-shrink-0 transition-colors"
                               >
                                 {task.status === "done" ? (
                                   <CheckCircle2 className="h-4 w-4 text-primary" />
                                 ) : (
                                   <Circle className="h-4 w-4 text-muted-foreground" />
                                 )}
                               </button>
                               <h4
                                 className={`font-medium text-sm flex-1 ${
                                   task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                                 }`}
                               >
                                 {task.title}
                               </h4>
                             </div>
                             {task.description && (
                               <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                 {task.description}
                               </p>
                             )}
                             <div className="flex gap-2 flex-wrap mb-3">
                               <span
                                 className={`text-xs px-2 py-0.5 rounded font-medium ${getPriorityColor(
                                   task.priority
                                 )}`}
                               >
                                 {task.priority === "high" ? t("common.high_priority") : task.priority === "medium" ? t("common.medium_priority") : t("common.low_priority")}
                               </span>
                               {task.subject_name && (
                                 <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                   {task.subject_name}
                                 </span>
                               )}
                             </div>
                             <div className="text-xs text-muted-foreground mb-3 space-y-1">
                               <p>{t("pages.deadline")}: {getDaysUntilDue(task.deadline || task.due_date || new Date().toISOString())}</p>
                               {task.estimated_minutes && (
                                 <p>{t("pages.estimate")}: ~{task.estimated_minutes}min</p>
                               )}
                               {task.actual_minutes && (
                                 <p className="text-primary font-medium">{t("pages.spent")}: {task.actual_minutes}min</p>
                               )}
                             </div>
                             <div className="flex gap-1 justify-end pt-2 border-t border-slate-200">
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => handleEdit(task)}
                                 className="h-6 w-6 hover:text-primary"
                               >
                                 <Edit2 className="h-3 w-3" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => handleDelete(task.id)}
                                 className="h-6 w-6 hover:text-destructive"
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             </div>
                           </CardContent>
                         </Card>
                       ))
                     )}
                   </div>
                 </div>
               )
             })}
           </div>
         )}
     </div>
   )
}
