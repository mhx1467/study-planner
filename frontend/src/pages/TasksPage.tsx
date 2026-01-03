import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Edit2, Trash2, CheckCircle2, Circle, BookMarked } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  subject_id?: number
  subject_name?: string
  priority: "low" | "medium" | "high"
  due_date: string
  completed: boolean
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_name: "",
    priority: "medium" as "low" | "medium" | "high",
    due_date: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Task title is required")
      return
    }

    if (!formData.due_date) {
      setError("Due date is required")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Integrate with API
      if (editingId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingId ? { ...t, ...formData, completed: t.completed } : t
          )
        )
      } else {
        const newTask: Task = {
          id: Date.now(),
          ...formData,
          completed: false,
        }
        setTasks((prev) => [...prev, newTask])
      }
      setFormData({
        title: "",
        description: "",
        subject_name: "",
        priority: "medium",
        due_date: "",
      })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError("Failed to save task")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      subject_name: task.subject_name || "",
      priority: task.priority,
      due_date: task.due_date,
    })
    setEditingId(task.id)
    setShowForm(true)
  }

  const handleToggleComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      subject_name: "",
      priority: "medium",
      due_date: "",
    })
    setEditingId(null)
    setShowForm(false)
    setError("")
  }

  const filteredTasks = filterPriority === "all"
    ? tasks
    : tasks.filter((t) => t.priority === filterPriority)

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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your study tasks and assignments
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      {/* Form Card */}
      {showForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Task" : "Create New Task"}</CardTitle>
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
                    Task Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Complete math homework"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="due_date" className="text-sm font-medium text-primary">
                    Due Date *
                  </label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="subject_name" className="text-sm font-medium text-primary">
                    Subject
                  </label>
                  <Input
                    id="subject_name"
                    name="subject_name"
                    placeholder="e.g., Mathematics"
                    value={formData.subject_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-primary">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-primary">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add details about this task"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Task" : "Create Task")}
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
            All ({tasks.length})
          </Button>
          <Button
            variant={filterPriority === "high" ? "default" : "outline"}
            onClick={() => setFilterPriority("high")}
            size="sm"
          >
            High ({tasks.filter((t) => t.priority === "high").length})
          </Button>
          <Button
            variant={filterPriority === "medium" ? "default" : "outline"}
            onClick={() => setFilterPriority("medium")}
            size="sm"
          >
            Medium ({tasks.filter((t) => t.priority === "medium").length})
          </Button>
          <Button
            variant={filterPriority === "low" ? "default" : "outline"}
            onClick={() => setFilterPriority("low")}
            size="sm"
          >
            Low ({tasks.filter((t) => t.priority === "low").length})
          </Button>
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12 border-primary/20">
          <CardContent>
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {tasks.length === 0 ? "No tasks yet" : "No tasks match your filter"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {tasks.length === 0
                ? "Create your first task to get started"
                : "Try adjusting your filter settings"}
            </p>
            {tasks.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks
            .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
            .map((task) => (
              <Card
                key={task.id}
                className={`border-l-4 hover:shadow-lg transition-all cursor-pointer ${
                  task.completed
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
                      onClick={() => handleToggleComplete(task.id)}
                      className="mt-1 flex-shrink-0 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-foreground ${
                          task.completed ? "line-through text-muted-foreground" : ""
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
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Due in {getDaysUntilDue(task.due_date)} days
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
