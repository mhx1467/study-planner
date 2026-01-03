import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react"

interface Statistics {
  totalTasks: number
  completedTasks: number
  completionRate: number
  totalHours: number
  subjectStats: Array<{
    name: string
    tasksCompleted: number
    hoursSpent: number
  }>
  weeklyProgress: Array<{
    day: string
    tasksCompleted: number
    hoursSpent: number
  }>
}

export function StatisticsPage() {
  // Mock data - will be replaced with API calls
  const stats: Statistics = {
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    totalHours: 0,
    subjectStats: [],
    weeklyProgress: [
      { day: "Mon", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Tue", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Wed", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Thu", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Fri", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Sat", tasksCompleted: 0, hoursSpent: 0 },
      { day: "Sun", tasksCompleted: 0, hoursSpent: 0 },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Statistics
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Track your study progress and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Tasks</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{stats.completedTasks}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed Tasks</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.completionRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{stats.totalHours}</div>
            <p className="text-sm text-muted-foreground mt-1">Total Hours Studied</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Progress Chart */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Weekly Progress</CardTitle>
            </div>
            <CardDescription>Tasks completed this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-sm">
                Chart visualization will be available with API data
              </p>
            </div>

            {/* Placeholder bar chart */}
            <div className="space-y-3 mt-6">
              {stats.weeklyProgress.map((day, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{day.day}</span>
                    <span className="text-muted-foreground">{day.tasksCompleted} tasks</span>
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
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Subject Distribution</CardTitle>
            </div>
            <CardDescription>Tasks completed by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.subjectStats.length === 0 ? (
              <div className="text-center py-12">
                <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  No data available. Complete tasks to see your distribution
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.subjectStats.map((subject, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">{subject.name}</span>
                      <span className="text-muted-foreground">{subject.tasksCompleted} tasks</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (subject.tasksCompleted /
                              (stats.subjectStats.reduce((a, s) => a + s.tasksCompleted, 0) || 1)) *
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
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">Current Streak</h3>
              <p className="text-muted-foreground text-sm">Keep up your consistent study habits</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-muted-foreground">days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <Card className="mt-8 border-sky-blue/50 bg-sky-blue/5">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            📊 <span className="font-medium">Note:</span> Statistics are calculated based on your completed tasks and study time logged in the system. Start creating tasks and tracking your study sessions to see meaningful insights here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
