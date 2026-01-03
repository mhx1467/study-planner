import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertCircle } from "lucide-react"
import { useStatistics } from "@/hooks/useApi"

interface Statistics {
   totalTasks?: number
   completedTasks?: number
   completionRate?: number
   totalHours?: number
   subjectStats?: Array<{
     name: string
     tasksCompleted?: number
     hoursSpent?: number
   }>
   weeklyProgress?: Array<{
     day: string
     tasksCompleted?: number
     hoursSpent?: number
   }>
 }

 export function StatisticsPage() {
   const [period, setPeriod] = useState<"week" | "month" | "all">("week")
   const { data: stats = {}, isLoading, error } = useStatistics(period)

   const displayStats: Statistics = {
     totalTasks: stats.totalTasks || 0,
     completedTasks: stats.completedTasks || 0,
     completionRate: stats.completionRate || 0,
     totalHours: stats.totalHours || 0,
     subjectStats: stats.subjectStats || [],
     weeklyProgress: stats.weeklyProgress || [
       { day: "Pon", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Wt", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Śr", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Czw", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Pt", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Sob", tasksCompleted: 0, hoursSpent: 0 },
       { day: "Nd", tasksCompleted: 0, hoursSpent: 0 },
     ],
   }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <Card className="mb-8 border-slate-300">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Ładowanie statystyk...</p>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">Błąd podczas ładowania statystyk</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Statystyki
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Śledź postęp w nauce i wydajność
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-8 flex gap-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            onClick={() => setPeriod("week")}
            size="sm"
          >
            Tydzień
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            onClick={() => setPeriod("month")}
            size="sm"
          >
            Miesiąc
          </Button>
          <Button
            variant={period === "all" ? "default" : "outline"}
            onClick={() => setPeriod("all")}
            size="sm"
          >
            Wszystko
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{displayStats.totalTasks}</div>
              <p className="text-sm text-muted-foreground mt-1">Wszystkie zadania</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{displayStats.completedTasks}</div>
              <p className="text-sm text-muted-foreground mt-1">Ukończone zadania</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{displayStats.completionRate}%</div>
              <p className="text-sm text-muted-foreground mt-1">Procent ukończenia</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{displayStats.totalHours}</div>
              <p className="text-sm text-muted-foreground mt-1">Godzin nauki</p>
            </CardContent>
          </Card>
        </div>

       {/* Charts Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         {/* Weekly Progress Chart */}
         <Card className="border-slate-300">
           <CardHeader>
             <div className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-primary" />
               <CardTitle>Postęp tygodniowy</CardTitle>
             </div>
             <CardDescription>Zadania ukończone w tym tygodniu</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-center py-12">
               <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
               <p className="text-muted-foreground text-sm">
                 Wizualizacja wykresu będzie dostępna z danymi API
               </p>
             </div>

              {/* Placeholder bar chart */}
              <div className="space-y-3 mt-6">
                {displayStats.weeklyProgress?.map((day, idx) => (
                 <div key={idx} className="space-y-1">
                   <div className="flex justify-between text-sm">
                     <span className="font-medium text-foreground">{day.day}</span>
                     <span className="text-muted-foreground">{day.tasksCompleted} zadań</span>
                   </div>
                   <div className="h-2 bg-muted rounded-full overflow-hidden">
                     <div
                       className="h-full bg-gradient-to-r from-primary to-secondary"
                       style={{ width: `${Math.random() * 100}%` }}
                     />
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>

         {/* Subject Distribution Chart */}
         <Card className="border-slate-300">
           <CardHeader>
             <div className="flex items-center gap-2">
               <PieChartIcon className="h-5 w-5 text-primary" />
               <CardTitle>Rozkład przedmiotów</CardTitle>
             </div>
             <CardDescription>Zadania ukończone wg przedmiotu</CardDescription>
           </CardHeader>
            <CardContent>
              {displayStats.subjectStats && displayStats.subjectStats.length === 0 ? (
               <div className="text-center py-12">
                 <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                 <p className="text-muted-foreground text-sm">
                   Brak danych. Ukoncz zadania, aby zobaczyć swój rozkład
                 </p>
               </div>
              ) : (
                <div className="space-y-4">
                  {displayStats.subjectStats?.map((subject, idx) => (
                   <div key={idx} className="space-y-1">
                     <div className="flex justify-between text-sm">
                       <span className="font-medium text-foreground">{subject.name}</span>
                       <span className="text-muted-foreground">{subject.tasksCompleted} zadań</span>
                     </div>
                     <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              (subject.tasksCompleted || 0) /
                                ((displayStats.subjectStats?.reduce((a, s) => a + (s.tasksCompleted || 0), 0)) || 1) *
                              100
                            }%`,
                          }}
                        />
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
       </div>

       {/* Study Streak Card */}
       <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-slate-300">
         <CardContent className="pt-6">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/20 rounded-lg">
               <TrendingUp className="h-6 w-6 text-primary" />
             </div>
             <div className="flex-1">
               <h3 className="font-semibold text-foreground text-lg">Bieżący ciąg</h3>
               <p className="text-muted-foreground text-sm">Utrzymuj spójne nawyki nauki</p>
             </div>
             <div className="text-right">
               <div className="text-3xl font-bold text-primary">0</div>
               <p className="text-sm text-muted-foreground">dni</p>
             </div>
           </div>
         </CardContent>
       </Card>

       {/* Info Notice */}
       <Card className="mt-8 border-sky-blue/50 bg-sky-blue/5">
         <CardContent className="pt-6">
           <p className="text-sm text-foreground">
             <span className="font-medium">Uwaga:</span> Statystyki są obliczane na podstawie ukończonych zadań i czasu nauki zarejestrowanego w systemie. Zacznij tworzyć zadania i śledzić sesje nauki, aby zobaczyć wgląd tutaj.
           </p>
         </CardContent>
       </Card>
     </div>
   )
}
