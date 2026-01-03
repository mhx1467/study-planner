import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Plus, Edit2, Trash2, BookOpen } from "lucide-react"
import { useCreateSubject, useUpdateSubject, useDeleteSubject, useSubjects } from "@/hooks/useApi"

interface Subject {
  id: number
  name: string
  description: string
  created_at?: string
}

export function SubjectsPage() {
  const { data: subjects = [], isLoading: isLoadingSubjects, refetch } = useSubjects()
  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()
  const deleteSubject = useDeleteSubject()

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
       setError("Nazwa przedmiotu jest wymagana")
       return
     }

     try {
       if (editingId) {
         await updateSubject.mutateAsync({ id: editingId, ...formData })
       } else {
         await createSubject.mutateAsync(formData)
       }
       setFormData({ name: "", description: "" })
       setEditingId(null)
       setShowForm(false)
       refetch()
     } catch (err: any) {
       setError(err.response?.data?.detail || "Błąd podczas zapisywania przedmiotu")
       console.error(err)
     }
   }

   const handleEdit = (subject: Subject) => {
     setFormData({ name: subject.name, description: subject.description })
     setEditingId(subject.id)
     setShowForm(true)
   }

   const handleDelete = async (id: number) => {
     if (window.confirm("Czy na pewno chcesz usunąć ten przedmiot?")) {
       try {
         await deleteSubject.mutateAsync(id)
         refetch()
       } catch (err: any) {
         setError(err.response?.data?.detail || "Błąd podczas usuwania przedmiotu")
       }
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
             Przedmioty
           </h1>
           <p className="text-muted-foreground mt-2 text-lg">
             Zarządzaj swoimi przedmiotami i tematami nauki
           </p>
         </div>
         {!showForm && (
           <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
             <Plus className="h-4 w-4" />
             Nowy przedmiot
           </Button>
         )}
       </div>

       {/* Form Card */}
       {showForm && (
         <Card className="mb-8 border-slate-300">
           <CardHeader>
             <CardTitle>{editingId ? "Edytuj przedmiot" : "Utwórz nowy przedmiot"}</CardTitle>
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
                   Nazwa przedmiotu *
                 </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Np. Matematyka, Biologia, Historia"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={createSubject.isPending || updateSubject.isPending}
                  />
               </div>

               <div className="space-y-2">
                 <label htmlFor="description" className="text-sm font-medium text-primary">
                   Opis
                 </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Dodaj opis tego przedmiotu"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={createSubject.isPending || updateSubject.isPending}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    rows={3}
                  />
               </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={createSubject.isPending || updateSubject.isPending}>
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={createSubject.isPending || updateSubject.isPending}>
                    {(createSubject.isPending || updateSubject.isPending) ? (editingId ? "Aktualizowanie..." : "Tworzenie...") : (editingId ? "Aktualizuj przedmiot" : "Utwórz przedmiot")}
                  </Button>
                </div>
             </form>
           </CardContent>
         </Card>
       )}

        {/* Subjects Grid */}
        {isLoadingSubjects ? (
          <Card className="text-center py-12 border-slate-300">
            <CardContent>
              <p className="text-muted-foreground">Ładowanie przedmiotów...</p>
            </CardContent>
          </Card>
        ) : subjects.length === 0 ? (
         <Card className="text-center py-12 border-slate-300">
           <CardContent>
             <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
             <h3 className="text-lg font-medium text-foreground mb-2">Brak przedmiotów</h3>
             <p className="text-muted-foreground mb-6">
               Utwórz swój pierwszy przedmiot, aby rozpocząć plan nauki
             </p>
             <Button onClick={() => setShowForm(true)}>
               <Plus className="h-4 w-4 mr-2" />
               Utwórz pierwszy przedmiot
             </Button>
           </CardContent>
         </Card>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject: Subject) => (
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
                   Utworzono {subject.created_at ? new Date(subject.created_at).toLocaleDateString("pl-PL") : "dzisiaj"}
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </div>
   )
}
