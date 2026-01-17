import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertCircle } from "lucide-react"
import { useStatistics } from "@/hooks/useApi"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { useTranslation } from "@/hooks/useTranslation"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface Statistics {
   totalTasks?: number
   completedTasks?: number
   completionRate?: number
   totalHours?: number
   totalScheduledHours?: number
   tasksThisWeek?: number
   completedThisWeek?: number
   studyStreak?: number
   pendingTasks?: number
   inProgressTasks?: number
   subjectStats?: Array<{
     name: string
     tasksCompleted?: number
     totalTasks?: number
     completionRate?: number
   }>
   weeklyProgress?: Array<{
     day: string
     tasksCompleted?: number
     hoursSpent?: number
   }>
 }

    export function StatisticsPage() {
      const [period, setPeriod] = useState<"week" | "month" | "all">("week")
      const { data: stats, isLoading, error } = useStatistics(period)
      const { t } = useTranslation()

     const displayStats: Statistics = {
       totalTasks: stats?.totalTasks || 0,
       completedTasks: stats?.completedTasks || 0,
       completionRate: stats?.completionRate || 0,
       totalHours: stats?.totalHours || 0,
       subjectStats: stats?.subjectStats || [],
       weeklyProgress: stats?.weeklyProgress || [],
       studyStreak: stats?.studyStreak || 0,
     }

      // Generate unique pastel colors for subjects based on app's color palette
      const generateSubjectColors = (subjects: Array<{ name: string }>) => {
        const colors: { [key: string]: string } = {}
        // Soft pastel colors with high lightness (70-80%) and moderate saturation (60-75%)
        // Derived from the app's primary colors for visual consistency
        const pastelPalette = [
          "hsl(18, 100%, 70%)",      // Pastel orange
          "hsl(45, 100%, 75%)",      // Pastel yellow
          "hsl(199, 100%, 75%)",     // Pastel sky blue
          "hsl(320, 100%, 75%)",     // Pastel pink
          "hsl(145, 70%, 75%)",      // Pastel teal
          "hsl(265, 70%, 75%)",      // Pastel purple
          "hsl(25, 95%, 75%)",       // Pastel apricot
          "hsl(200, 85%, 75%)",      // Pastel light blue
          "hsl(340, 80%, 75%)",      // Pastel rose
          "hsl(120, 70%, 75%)",      // Pastel green
          "hsl(270, 70%, 75%)",      // Pastel lavender
          "hsl(35, 90%, 75%)",       // Pastel golden
          "hsl(180, 75%, 75%)",      // Pastel cyan
          "hsl(0, 80%, 75%)",        // Pastel red
        ]
        
        subjects.forEach((subject, index) => {
          const colorIndex = index % pastelPalette.length
          colors[subject.name] = pastelPalette[colorIndex]
        })
        
        return colors
      }

     const subjectColors = generateSubjectColors(displayStats.subjectStats || [])

     return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {isLoading && (
           <Card className="mb-8 border-slate-300">
             <CardContent className="pt-6">
               <p className="text-center text-muted-foreground">{t("pages.loading_statistics")}</p>
             </CardContent>
           </Card>
         )}
         
         {error && (
           <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
             <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
             <p className="text-sm text-destructive">{t("pages.statistics_error")}</p>
           </div>
         )}

         <div className="mb-8">
           <h1 className="text-4xl font-bold text-primary">
             {t("pages.statistics")}
           </h1>
           <p className="text-muted-foreground mt-2 text-lg">
             {t("pages.statistics_description")}
           </p>
         </div>

         {/* Period Selector */}
         <div className="mb-8 flex gap-2">
           <Button
             variant={period === "week" ? "default" : "outline"}
             onClick={() => setPeriod("week")}
             size="sm"
           >
             {t("pages.period_week")}
           </Button>
           <Button
             variant={period === "month" ? "default" : "outline"}
             onClick={() => setPeriod("month")}
             size="sm"
           >
             {t("pages.period_month")}
           </Button>
           <Button
             variant={period === "all" ? "default" : "outline"}
             onClick={() => setPeriod("all")}
             size="sm"
           >
             {t("pages.period_all")}
           </Button>
         </div>

         {/* Key Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <Card className="border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <div className="text-2xl font-bold text-primary">{displayStats.totalTasks}</div>
               <p className="text-sm text-muted-foreground mt-1">{t("pages.all_tasks_metric")}</p>
             </CardContent>
           </Card>

           <Card className="border-l-4 border-l-secondary">
             <CardContent className="pt-6">
               <div className="text-2xl font-bold text-secondary">{displayStats.completedTasks}</div>
               <p className="text-sm text-muted-foreground mt-1">{t("pages.completed_tasks_metric")}</p>
             </CardContent>
           </Card>

           <Card className="border-l-4 border-l-primary">
             <CardContent className="pt-6">
               <div className="text-2xl font-bold text-primary">{displayStats.completionRate}%</div>
               <p className="text-sm text-muted-foreground mt-1">{t("pages.completion_percent_metric")}</p>
             </CardContent>
           </Card>

           <Card className="border-l-4 border-l-secondary">
             <CardContent className="pt-6">
               <div className="text-2xl font-bold text-secondary">{displayStats.totalHours}</div>
               <p className="text-sm text-muted-foreground mt-1">{t("pages.study_hours_metric")}</p>
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
                <CardTitle>{t("pages.weekly_progress_title")}</CardTitle>
              </div>
              <CardDescription>{t("pages.weekly_progress_description")}</CardDescription>
            </CardHeader>
             <CardContent>
               {displayStats.weeklyProgress && displayStats.weeklyProgress.length > 0 ? (
                   <>
                    <div style={{ position: "relative", height: "300px", width: "100%", marginBottom: "1.5rem" }}>
                      <Bar
                        data={{
                          labels: displayStats.weeklyProgress.map((d) => d.day.substring(0, 3)),
                          datasets: [
                            {
                              label: t("pages.completed_tasks_chart"),
                              data: displayStats.weeklyProgress.map((d) => d.tasksCompleted || 0),
                              backgroundColor: "hsl(18, 100%, 50%)",
                              borderColor: "hsl(18, 100%, 50%)",
                              borderWidth: 1,
                              borderRadius: 4,
                            },
                          ],
                        }}
                       options={{
                         responsive: true,
                         maintainAspectRatio: false,
                         plugins: {
                           legend: {
                             display: true,
                             position: "top" as const,
                           },
                           tooltip: {
                             enabled: true,
                           },
                         },
                         scales: {
                           y: {
                             beginAtZero: true,
                             ticks: {
                               stepSize: 1,
                             },
                           },
                         },
                       }}
                     />
                   </div>

                   {/* Weekly progress bars */}
                   <div className="space-y-3">
                     {displayStats.weeklyProgress.map((day, idx) => {
                       const maxTasks = Math.max(...(displayStats.weeklyProgress?.map(d => d.tasksCompleted || 0) || [1]));
                       const barWidth = maxTasks > 0 ? ((day.tasksCompleted || 0) / maxTasks) * 100 : 0;
                       return (
                         <div key={idx} className="space-y-1">
                           <div className="flex justify-between text-sm">
                             <span className="font-medium text-foreground">{day.day}</span>
                             <span className="text-muted-foreground">{day.tasksCompleted} {t("pages.tasks_unit")}, {day.hoursSpent}h</span>
                           </div>
                           <div className="h-2 bg-muted rounded-full overflow-hidden">
                             <div
                               className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                               style={{ width: `${barWidth}%` }}
                             />
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </>
               ) : (
                 <div className="text-center py-12">
                   <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                   <p className="text-muted-foreground text-sm">
                     {t("pages.no_weekly_data")}
                   </p>
                 </div>
               )}
             </CardContent>
          </Card>

          {/* Subject Distribution Chart */}
          <Card className="border-slate-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle>{t("pages.subject_distribution_title")}</CardTitle>
              </div>
              <CardDescription>{t("pages.subject_distribution_description")}</CardDescription>
            </CardHeader>
              <CardContent>
                {displayStats.subjectStats && displayStats.subjectStats.length > 0 ? (
                  <>
                    <div style={{ position: "relative", height: "300px", width: "100%", marginBottom: "1.5rem" }}>
                       <Pie
                          data={{
                            labels: displayStats.subjectStats?.map((s) => s.name) || [],
                            datasets: [
                              {
                                data: displayStats.subjectStats?.map((s) => s.tasksCompleted || 0) || [],
                                backgroundColor: displayStats.subjectStats?.map((s) => subjectColors[s.name]) || [],
                                borderColor: displayStats.subjectStats?.map((s) => subjectColors[s.name]) || [],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom" as const,
                            },
                            tooltip: {
                              enabled: true,
                            },
                          },
                        }}
                      />
                    </div>

                     <div className="space-y-4">
                       {displayStats.subjectStats?.map((subject, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{subject.name}</span>
                            <span className="text-muted-foreground">{subject.tasksCompleted}/{subject.totalTasks} ({subject.completionRate}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                             <div
                               className="h-full transition-all"
                               style={{
                                 backgroundColor: subjectColors[subject.name],
                                 width: `${
                                   (subject.tasksCompleted || 0) /
                                     ((displayStats.subjectStats?.reduce((a, s) => a + (s.totalTasks || 0), 0)) || 1) *
                                   100
                                 }%`,
                               }}
                             />
                          </div>
                        </div>
                      ))}
                     </div>
                  </>
               ) : (
                 <div className="text-center py-12">
                   <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                   <p className="text-muted-foreground text-sm">
                     {t("pages.no_subject_data")}
                   </p>
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
                <h3 className="font-semibold text-foreground text-lg">{t("pages.your_streak")}</h3>
                <p className="text-muted-foreground text-sm">{t("pages.streak_description")}</p>
              </div>
               <div className="text-right">
                 <div className="text-3xl font-bold text-primary">{stats?.studyStreak || 0}</div>
                 <p className="text-sm text-muted-foreground">{t("pages.days_unit")}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Notice */}
        <Card className="mt-8 border-sky-blue/50 bg-sky-blue/5">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground">
              <span className="font-medium">{t("pages.note")}:</span> {t("pages.statistics_info")}
            </p>
          </CardContent>
        </Card>
      </div>
    )
}
