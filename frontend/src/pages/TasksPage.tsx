import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Edit2, Trash2, CheckCircle2, Circle, BookMarked } from "lucide-react"
import { useCreateTask, useUpdateTask, useDeleteTask, useTasks, useSubjects } from "@/hooks/useApi"

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
 }

export function TasksPage() {
   const { data: tasks = [], isLoading: isLoadingTasks, refetch } = useTasks()
   const { data: subjects = [] } = useSubjects()
   const createTask = useCreateTask()
   const updateTask = useUpdateTask()
   const deleteTask = useDeleteTask()
   const subjectDropdownRef = useRef<HTMLDivElement>(null)

   const [error, setError] = useState("")
   const [showForm, setShowForm] = useState(false)
   const [editingId, setEditingId] = useState<number | null>(null)
   const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
   const [subjectSearch, setSubjectSearch] = useState("")
   const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
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
        setError("Tytuł zadania jest wymagany")
        return
      }

      if (!formData.due_date) {
        setError("Data wykonania jest wymagana")
        return
      }

      if (!formData.estimated_minutes || formData.estimated_minutes < 15) {
        setError("Szacunkowy czas musi wynosić co najmniej 15 minut")
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
        } else {
          await createTask.mutateAsync({
            title: formData.title,
            description: formData.description,
            subject_id: formData.subject_id || undefined,
            priority: formData.priority,
            deadline: new Date(formData.due_date).toISOString(),
            estimated_minutes: formData.estimated_minutes,
          })
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
      } catch (err: any) {
        setError(err.response?.data?.detail || "Błąd podczas zapisywania zadania")
        console.error(err)
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
       if (window.confirm("Czy na pewno chcesz usunąć to zadanie?")) {
         try {
           await deleteTask.mutateAsync(id)
           refetch()
         } catch (err: any) {
           setError(err.response?.data?.detail || "Błąd podczas usuwania zadania")
         }
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

    const handleToggleComplete = async (task: Task) => {
      try {
        const dateStr = task.deadline || task.due_date || new Date().toISOString()
        await updateTask.mutateAsync({
          id: task.id,
          title: task.title,
          description: task.description,
          subject_id: task.subject_id || undefined,
          priority: task.priority,
          deadline: dateStr.includes("T") ? dateStr : new Date(dateStr).toISOString(),
          estimated_minutes: task.estimated_minutes || 30,
          status: task.status === "done" ? "todo" : "done",
        })
        refetch()
      } catch (err: any) {
        setError(err.response?.data?.detail || "Błąd podczas aktualizacji zadania")
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    return days
  }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingTasks && (
          <Card className="mb-8 border-slate-300">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Ładowanie zadań...</p>
            </CardContent>
          </Card>
        )}
        
        <div className="mb-8 flex justify-between items-start">
         <div>
           <h1 className="text-4xl font-bold text-primary">
             Zadania
           </h1>
           <p className="text-muted-foreground mt-2 text-lg">
             Zarządzaj swoimi zadaniami edukacyjnymi
           </p>
         </div>
         {!showForm && (
           <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
             <Plus className="h-4 w-4" />
             Nowe zadanie
           </Button>
         )}
       </div>

       {/* Form Card */}
       {showForm && (
         <Card className="mb-8 border-slate-300">
           <CardHeader>
             <CardTitle>{editingId ? "Edytuj zadanie" : "Utwórz nowe zadanie"}</CardTitle>
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
                     Tytuł zadania *
                   </label>
                   <Input
                     id="title"
                     name="title"
                      placeholder="Np. Zrobić pracę domową z matematyki"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={createTask.isPending || updateTask.isPending}
                    />
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="due_date" className="text-sm font-medium text-primary">
                     Data wykonania *
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
                      Przedmiot
                    </label>
                    <div className="relative" ref={subjectDropdownRef}>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                           <Input
                             id="subject_search"
                             placeholder="Szukaj przedmiotu..."
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
                                     ? "Brak utworzonych przedmiotów"
                                     : "Brak pasujących przedmiotów"}
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
                           Wybrany: {formData.subject_name}
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label htmlFor="priority" className="text-sm font-medium text-primary">
                       Priorytet
                     </label>
                     <select
                       id="priority"
                       name="priority"
                       value={formData.priority}
                       onChange={handleChange}
                       disabled={createTask.isPending || updateTask.isPending}
                       className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                     >
                       <option value="low">Niski</option>
                       <option value="medium">Średni</option>
                       <option value="high">Wysoki</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <label htmlFor="estimated_minutes" className="text-sm font-medium text-primary">
                       Szacunkowy czas (minuty) *
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
                     <p className="text-xs text-muted-foreground">Minimalnie 15 minut, maksymalnie 480 minut</p>
                   </div>
                 </div>

               <div className="space-y-2">
                 <label htmlFor="description" className="text-sm font-medium text-primary">
                   Opis
                 </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Dodaj szczegóły tego zadania"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={createTask.isPending || updateTask.isPending}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    rows={3}
                  />
               </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={createTask.isPending || updateTask.isPending}>
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
                    {createTask.isPending || updateTask.isPending ? (editingId ? "Aktualizowanie..." : "Tworzenie...") : (editingId ? "Aktualizuj zadanie" : "Utwórz zadanie")}
                  </Button>
                </div>
             </form>
           </CardContent>
         </Card>
       )}

       {/* Filter Buttons */}
       {tasks.length > 0 && (
         <div className="mb-6 flex gap-2 flex-wrap">
           <Button
             variant={filterPriority === "all" ? "default" : "outline"}
             onClick={() => setFilterPriority("all")}
             size="sm"
           >
             Wszystkie ({tasks.length})
           </Button>
           <Button
             variant={filterPriority === "high" ? "default" : "outline"}
             onClick={() => setFilterPriority("high")}
             size="sm"
           >
             Wysokie (            {tasks.filter((t: Task) => t.priority === "high").length})
           </Button>
           <Button
             variant={filterPriority === "medium" ? "default" : "outline"}
             onClick={() => setFilterPriority("medium")}
             size="sm"
           >
              Średnie ({tasks.filter((t: Task) => t.priority === "medium").length})
           </Button>
           <Button
             variant={filterPriority === "low" ? "default" : "outline"}
             onClick={() => setFilterPriority("low")}
             size="sm"
           >
              Niskie ({tasks.filter((t: Task) => t.priority === "low").length})
           </Button>
         </div>
       )}

       {/* Tasks List */}
       {filteredTasks.length === 0 ? (
         <Card className="text-center py-12 border-slate-300">
           <CardContent>
             <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
             <h3 className="text-lg font-medium text-foreground mb-2">
               {tasks.length === 0 ? "Brak zadań" : "Brak zadań pasujących do filtra"}
             </h3>
             <p className="text-muted-foreground mb-6">
               {tasks.length === 0
                 ? "Utwórz pierwsze zadanie, aby zacząć"
                 : "Spróbuj zmienić ustawienia filtra"}
             </p>
             {tasks.length === 0 && (
               <Button onClick={() => setShowForm(true)}>
                 <Plus className="h-4 w-4 mr-2" />
                 Utwórz pierwsze zadanie
               </Button>
             )}
           </CardContent>
         </Card>
       ) : (
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
                              {task.priority === "high" ? "Wysoki" : task.priority === "medium" ? "Średni" : "Niski"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Termin za {getDaysUntilDue(task.deadline || task.due_date || new Date().toISOString())} dni
                            </span>
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
       )}
     </div>
   )
}
