import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { useTasks, useSubjects, useStatistics } from "@/hooks/useApi"
import { useTranslation } from "@/hooks/useTranslation"

interface Task {
  id: number
  title: string
  description: string
  subject_id?: number | null
  subject_name?: string
  priority: "low" | "medium" | "high"
  due_date: string
  deadline?: string
  completed: boolean
  status?: "todo" | "in_progress" | "done"
}


export function DashboardPage() {
    const { user } = useAuth()
    const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects()
    const { data: tasks = [], isLoading: isLoadingTasks } = useTasks()
    const { data: stats, isLoading: isLoadingStats } = useStatistics("week")
    const { t, tf } = useTranslation()

    const pendingTasks = tasks.filter((t: Task) => t.status !== "done").length
    const completionRate = tasks.length > 0 ? Math.round((tasks.filter((t: Task) => t.status === "done").length / tasks.length) * 100) : 0
    const weeklyHours = stats?.totalHours || 0

    const isLoading = isLoadingSubjects || isLoadingTasks || isLoadingStats

    const getDeadlineColor = (dueDate: string) => {
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))
      
      if (diffDays < 0) {
        return "bg-red-600 text-white" // overdue
      } else if (diffDays <= 1) {
        return "bg-red-500 text-white" // due today/tomorrow
      } else if (diffDays <= 3) {
        return "bg-orange-500 text-white" // 2-3 days
      } else if (diffDays <= 7) {
        return "bg-yellow-500 text-white" // 4-7 days
      } else {
        return "bg-green-500 text-white" // more than a week
      }
    }

     const getDaysUntilDue = (dueDate: string) => {
       const today = new Date()
       const due = new Date(dueDate)
       const diffTime = due.getTime() - today.getTime()
       const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))
       
       if (diffDays < 0) {
         return tf("pages.dashboard.overdue", { count: Math.abs(diffDays) })
       } else if (diffDays === 0) {
         return t("pages.dashboard.today")
       } else if (diffDays === 1) {
         return t("pages.dashboard.tomorrow")
       } else {
         return tf("pages.dashboard.in_days", { count: diffDays })
       }
     }

     return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <Card className="mb-8 border-slate-300">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">{t("toasts.info.loading_data.title")}</p>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">
            {tf("pages.dashboard.title", { username: user?.username || "Unknown" })}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {t("pages.dashboard.subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{subjects.length}</div>
              <p className="text-sm text-muted-foreground mt-1">{t("pages.dashboard.pending_tasks")}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{pendingTasks}</div>
              <p className="text-sm text-muted-foreground mt-1">{t("pages.dashboard.pending_tasks")}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <p className="text-sm text-muted-foreground mt-1">{t("pages.dashboard.completion_rate")}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{weeklyHours}</div>
              <p className="text-sm text-muted-foreground mt-1">{t("pages.dashboard.metric_total_hours")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardDescription>{t("pages.dashboard.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">{t("pages.dashboard.no_tasks")}</p>
                  <Link to="/tasks">
                    <Button variant="outline">{t("buttons.create_first_task")}</Button>
                  </Link>
                </div>
              ) : (
                 <div className="space-y-3">
                   {tasks.slice(0, 5).map((task: Task) => (
                     <div key={task.id} className="p-3 border border-slate-300 rounded-lg hover:bg-primary/5 transition-colors">
                       <div className="flex items-start justify-between gap-4">
                         <div className="flex-1 min-w-0">
                           <h4 className={`font-medium text-foreground ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                             {task.title}
                           </h4>
                           <div className="flex gap-2 items-center mt-2 flex-wrap">
                             {task.subject_name && (
                               <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-medium">
                                 {task.subject_name}
                               </span>
                             )}
                             <span className={`text-xs px-2 py-1 rounded whitespace-nowrap font-medium ${getDeadlineColor(task.deadline || task.due_date)}`}>
                               {getDaysUntilDue(task.deadline || task.due_date)}
                             </span>
                           </div>
                         </div>
                         <div className="flex gap-2 items-center flex-shrink-0">
                           <span className={`text-xs px-2 py-1 rounded whitespace-nowrap font-medium ${
                             task.status === "done" ? "bg-green-100 text-green-700" :
                             task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                             "bg-gray-100 text-gray-700"
                           }`}>
                             {task.status === "done" ? t("pages.dashboard.completed") : task.status === "in_progress" ? t("pages.dashboard.in_progress") : t("pages.dashboard.todo")}
                           </span>
                           <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                             {task.priority === "high" ? t("common.high") : task.priority === "medium" ? t("common.medium") : t("common.low")}
                           </span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </CardContent>
          </Card>

         <Card>
           <CardHeader>
             <CardTitle>{t("pages.dashboard.quick_actions")}</CardTitle>
           </CardHeader>
           <CardContent className="space-y-2">
             <Link to="/subjects" className="block">
               <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                 {t("buttons.create_subject")}
               </Button>
             </Link>
             <Link to="/tasks" className="block">
               <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                 {t("buttons.add_task")}
               </Button>
             </Link>
             <Link to="/schedule" className="block">
               <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                 {t("buttons.view_schedule")}
               </Button>
             </Link>
             <Link to="/statistics" className="block">
               <Button variant="outline" className="w-full justify-start hover:border-slate-300 hover:text-primary">
                 {t("buttons.view_statistics")}
               </Button>
             </Link>
           </CardContent>
         </Card>
       </div>
     </div>
   )
}
