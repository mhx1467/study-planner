import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { useTasks, useSubjects, useStatistics } from "@/hooks/useApi"

interface Task {
  id: number
  title: string
  description: string
  subject_id?: number | null
  subject_name?: string
  priority: "low" | "medium" | "high"
  due_date: string
  completed: boolean
}


export function DashboardPage() {
   const { user } = useAuth()
   const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects()
   const { data: tasks = [], isLoading: isLoadingTasks } = useTasks()
   const { data: stats = {}, isLoading: isLoadingStats } = useStatistics("week")

   const pendingTasks = tasks.filter((t: Task) => !t.completed).length
   const completionRate = tasks.length > 0 ? Math.round((tasks.filter((t: Task) => t.completed).length / tasks.length) * 100) : 0
   const weeklyHours = stats.totalHours || 0

   const isLoading = isLoadingSubjects || isLoadingTasks || isLoadingStats

   return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {isLoading && (
         <Card className="mb-8 border-slate-300">
           <CardContent className="pt-6">
             <p className="text-center text-muted-foreground">Ładowanie pulpitu...</p>
           </CardContent>
         </Card>
       )}

       <div className="mb-8">
         <h1 className="text-4xl font-bold text-primary">
           Witaj ponownie, {user?.username}!
         </h1>
         <p className="text-muted-foreground mt-2 text-lg">
           Oto podsumowanie Twojego postępu w nauce
         </p>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <Card className="border-l-4 border-l-primary">
           <CardContent className="pt-6">
             <div className="text-2xl font-bold text-primary">{subjects.length}</div>
             <p className="text-sm text-muted-foreground mt-1">Aktywne przedmioty</p>
           </CardContent>
         </Card>

         <Card className="border-l-4 border-l-secondary">
           <CardContent className="pt-6">
             <div className="text-2xl font-bold text-secondary">{pendingTasks}</div>
             <p className="text-sm text-muted-foreground mt-1">Oczekujące zadania</p>
           </CardContent>
         </Card>

         <Card className="border-l-4 border-l-primary">
           <CardContent className="pt-6">
             <div className="text-2xl font-bold text-primary">{completionRate}%</div>
             <p className="text-sm text-muted-foreground mt-1">Stopień ukończenia</p>
           </CardContent>
         </Card>

         <Card className="border-l-4 border-l-secondary">
           <CardContent className="pt-6">
             <div className="text-2xl font-bold text-secondary">{weeklyHours}</div>
             <p className="text-sm text-muted-foreground mt-1">Godzin w tym tygodniu</p>
           </CardContent>
         </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle>Ostatnie zadania</CardTitle>
             <CardDescription>Twoje najnowsze zadania edukacyjne</CardDescription>
           </CardHeader>
           <CardContent>
             {tasks.length === 0 ? (
               <div className="text-center py-8">
                 <p className="text-muted-foreground mb-4">Brak zadań</p>
                 <Link to="/tasks">
                   <Button variant="outline">Utwórz pierwsze zadanie</Button>
                 </Link>
               </div>
             ) : (
               <div className="space-y-3">
                 {tasks.slice(0, 5).map((task: Task) => (
                   <div key={task.id} className="p-3 border border-slate-300 rounded-lg hover:bg-primary/5 transition-colors">
                     <div className="flex items-start justify-between gap-4">
                       <div className="flex-1 min-w-0">
                         <h4 className={`font-medium text-foreground ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                           {task.title}
                         </h4>
                         {task.subject_name && (
                           <p className="text-xs text-muted-foreground mt-1">{task.subject_name}</p>
                         )}
                       </div>
                       <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                         {task.priority === "high" ? "Wysoki" : task.priority === "medium" ? "Średni" : "Niski"}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/subjects" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                Utwórz przedmiot
              </Button>
            </Link>
            <Link to="/tasks" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                Dodaj zadanie
              </Button>
            </Link>
            <Link to="/schedule" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                Wyświetl harmonogram
              </Button>
            </Link>
            <Link to="/statistics" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                Wyświetl statystyki
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
