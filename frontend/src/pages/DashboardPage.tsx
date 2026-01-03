import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"


export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Here's a summary of your learning progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-sm text-muted-foreground mt-1">Active Subjects</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">0</div>
            <p className="text-sm text-muted-foreground mt-1">Pending Tasks</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">0%</div>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">0</div>
            <p className="text-sm text-muted-foreground mt-1">Hours This Week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recent study tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Link to="/tasks">
                <Button variant="outline">Create your first task</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/subjects" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-primary hover:text-primary">
                Create Subject
              </Button>
            </Link>
            <Link to="/tasks" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-primary hover:text-primary">
                Add Task
              </Button>
            </Link>
            <Link to="/schedule" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-primary hover:text-primary">
                View Schedule
              </Button>
            </Link>
            <Link to="/statistics" className="block">
              <Button variant="outline" className="w-full justify-start hover:border-primary hover:text-primary">
                View Statistics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
