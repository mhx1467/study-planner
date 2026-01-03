import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Edit2, Trash2, BookOpen } from "lucide-react"

interface Subject {
  id: number
  name: string
  description: string
  color?: string
  created_at?: string
}

export function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Subject name is required")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Integrate with API
      if (editingId) {
        setSubjects((prev) =>
          prev.map((s) =>
            s.id === editingId ? { ...s, ...formData } : s
          )
        )
      } else {
        const newSubject: Subject = {
          id: Date.now(),
          ...formData,
        }
        setSubjects((prev) => [...prev, newSubject])
      }
      setFormData({ name: "", description: "" })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError("Failed to save subject")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (subject: Subject) => {
    setFormData({ name: subject.name, description: subject.description })
    setEditingId(subject.id)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({ name: "", description: "" })
    setEditingId(null)
    setShowForm(false)
    setError("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            Subjects
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your study subjects and topics
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Subject
          </Button>
        )}
      </div>

      {/* Form Card */}
      {showForm && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Subject" : "Create New Subject"}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-primary">
                  Subject Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Mathematics, Biology, History"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-primary">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add a description for this subject"
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
                  {isLoading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Subject" : "Create Subject")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <Card className="text-center py-12 border-primary/20">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No subjects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first subject to get started with your study plan
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">{subject.name}</CardTitle>
                    {subject.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {subject.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(subject)}
                      className="h-8 w-8 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subject.id)}
                      className="h-8 w-8 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Created {subject.created_at ? new Date(subject.created_at).toLocaleDateString() : "today"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
