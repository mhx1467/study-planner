import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns"

interface ScheduleEvent {
  id: number
  task_id: number
  title: string
  subject: string
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
}

export function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [events] = useState<ScheduleEvent[]>([])
  const [error] = useState("")

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getDayEvents = (date: Date): ScheduleEvent[] => {
    return events.filter((e) => isSameDay(new Date(e.date), date))
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Schedule
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          View and manage your study schedule
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Controls */}
      <Card className="mb-8 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))} size="sm">
                ← Previous
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())} size="sm">
                Today
              </Button>
              <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))} size="sm">
                Next →
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                onClick={() => setViewMode("day")}
                size="sm"
              >
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => setViewMode("week")}
                size="sm"
              >
                Week
              </Button>
            </div>

            <div className="flex items-center gap-2 text-foreground font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week View */}
      {viewMode === "week" && (
        <Card className="border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="w-16 bg-muted/50 p-3 text-left text-sm font-semibold text-foreground">
                    Time
                  </th>
                  {weekDays.map((day, idx) => (
                    <th
                      key={idx}
                      className={`p-3 text-center border-l border-primary/10 min-w-max ${
                        isToday(day) ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="font-semibold text-primary">
                        {format(day, "EEE")}
                      </div>
                      <div className={`text-sm ${isToday(day) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {format(day, "d")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((hour) => (
                  <tr key={hour} className="border-b border-primary/5 h-16">
                    <td className="w-16 bg-muted/50 p-2 text-right text-xs font-medium text-muted-foreground border-r border-primary/10">
                      {`${hour.toString().padStart(2, "0")}:00`}
                    </td>
                    {weekDays.map((day, dayIdx) => (
                      <td
                        key={`${hour}-${dayIdx}`}
                        className={`border-l border-primary/10 p-1 relative ${
                          isToday(day) ? "bg-primary/5" : ""
                        }`}
                      >
                        {getDayEvents(day)
                          .filter(
                            (e) =>
                              parseInt(e.start_time.split(":")[0]) === hour
                          )
                          .map((event) => (
                            <div
                              key={event.id}
                              className="bg-primary text-primary-foreground p-2 rounded text-xs font-medium mb-1 cursor-pointer hover:bg-orange-600 transition-colors"
                            >
                              <div className="font-semibold truncate">{event.title}</div>
                              <div className="text-xs opacity-90 truncate">
                                {event.subject}
                              </div>
                              <div className="text-xs opacity-75 flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {event.duration_minutes}m
                              </div>
                            </div>
                          ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length === 0 && (
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events scheduled</h3>
              <p className="text-muted-foreground">
                Generate a schedule or manually add events to get started
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Day View */}
      {viewMode === "day" && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{format(currentDate, "EEEE, MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDayEvents(currentDate).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No events today</h3>
                  <p className="text-muted-foreground">
                    You have a free day! Plan your study time
                  </p>
                </div>
              ) : (
                getDayEvents(currentDate)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <div className="text-primary font-bold text-lg min-w-fit">
                        {event.start_time}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.subject}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {event.start_time} - {event.end_time} ({event.duration_minutes} minutes)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Generation CTA */}
      <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Auto-Generate Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Let StudyPlanner intelligently schedule your tasks and subjects
              </p>
            </div>
            <Button className="whitespace-nowrap" disabled>
              Generate Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
