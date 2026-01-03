import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertCircle, Calendar, Clock, Wand2 } from "lucide-react"
import { format, startOfWeek, addDays, isToday, isSameDay, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { useSchedule, useGenerateSchedule, useSubjects } from "@/hooks/useApi"
import { GenerateScheduleDialog } from "@/components/GenerateScheduleDialog"
import type { GenerateScheduleParams } from "@/components/GenerateScheduleDialog"

interface ScheduleEvent {
  id: number
  task_id: number
  title: string
  subject_id: number
  start_time: string
  end_time: string
  description: string
  color?: string
}

export function SchedulePage() {
   const [currentDate, setCurrentDate] = useState(new Date())
   const [viewMode, setViewMode] = useState<"day" | "week">("week")
   const [error, setError] = useState("")
   const [showGenerateDialog, setShowGenerateDialog] = useState(false)
   const [openPopoverId, setOpenPopoverId] = useState<number | string | null>(null)
   
   const { data: events = [], isLoading, refetch } = useSchedule(currentDate)
   const generateSchedule = useGenerateSchedule()
   const { data: subjects = [] } = useSubjects()

   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

   // Helper function to get subject name by ID
   const getSubjectName = (subjectId: number) => {
     return subjects.find((s: any) => s.id === subjectId)?.name || "Bez przedmiotu"
   }

   // Helper function to extract date from ISO datetime string
   const getDateFromISO = (isoString: string): Date => {
     return parseISO(isoString)
   }

   // Helper function to format time from ISO datetime
   const formatTimeFromISO = (isoString: string): string => {
     return format(parseISO(isoString), "HH:mm")
   }

     const getDayEvents = (date: Date): ScheduleEvent[] => {
       return events.filter((e: ScheduleEvent) => isSameDay(getDateFromISO(e.start_time), date))
     }

      // Constants for layout
      const HOUR_HEIGHT = 120 // Fixed height per hour
      const TOTAL_DAY_HEIGHT = 24 * HOUR_HEIGHT // 24 hours * HOUR_HEIGHT per hour
      
      // Duration buckets: 0, 15, 30, 45, 60 minutes
      const DURATION_BUCKETS = [0, 15, 30, 45, 60]
      const BUCKET_HEIGHTS: { [key: number]: number } = {
        0: 24,    // Minimal height for very short events
        15: 30,   // Quarter hour
        30: 60,   // Half hour
        45: 90,   // Three quarter hour
        60: 120,  // Full hour (same as HOUR_HEIGHT)
      }

      // Helper function to bucket duration to nearest valid duration
      // For durations > 60, returns array of buckets that sum to fit the duration
      const bucketDuration = (durationMinutes: number): number[] => {
        if (durationMinutes === 0) return [0]
        
        // If duration is <= 60, find the closest single bucket
        if (durationMinutes <= 60) {
          let closestBucket = DURATION_BUCKETS[0]
          let minDistance = Math.abs(durationMinutes - closestBucket)
          
          for (const bucket of DURATION_BUCKETS) {
            const distance = Math.abs(durationMinutes - bucket)
            if (distance < minDistance) {
              minDistance = distance
              closestBucket = bucket
            }
          }
          
          return [closestBucket]
        }
        
        // For durations > 60, stack the largest buckets that fit
        const buckets: number[] = []
        let remaining = durationMinutes
        
        // Start with largest bucket and work down
        const sortedBuckets = [...DURATION_BUCKETS].reverse()
        
        while (remaining > 0) {
          // Find the largest bucket that fits in remaining duration
          let foundBucket = false
          
          for (const bucket of sortedBuckets) {
            if (bucket <= remaining) {
              buckets.push(bucket)
              remaining -= bucket
              foundBucket = true
              break
            }
          }
          
          // Safety check: if no bucket found, use the closest remaining
          if (!foundBucket) {
            // Find closest bucket to remaining
            let closestBucket = DURATION_BUCKETS[0]
            let minDistance = Math.abs(remaining - closestBucket)
            
            for (const bucket of DURATION_BUCKETS) {
              const distance = Math.abs(remaining - bucket)
              if (distance < minDistance) {
                minDistance = distance
                closestBucket = bucket
              }
            }
            
            buckets.push(closestBucket)
            break
          }
        }
        
        return buckets
      }
      
      // Helper function to get total height for a bucketed duration array
      const getHeightForDuration = (durationMinutes: number): number => {
        const bucketedDurations = bucketDuration(durationMinutes)
        return bucketedDurations.reduce((sum, bucket) => sum + (BUCKET_HEIGHTS[bucket] || BUCKET_HEIGHTS[60]), 0)
      }
      
      // Helper function to calculate max day height in the week
      // All days should be the same height
      const getMaxDayHeight = (): number => {
        // For now, return the fixed height - all days will have the same height
        return TOTAL_DAY_HEIGHT
      }

   const handleGenerateSchedule = async (params: GenerateScheduleParams) => {
     try {
       setError("")
       setShowGenerateDialog(false)
       
       // Convert end_date to ISO format if provided
       const queryParams = new URLSearchParams()
       if (params.end_date) {
         queryParams.append("end_date", params.end_date)
       }
       queryParams.append("short_break_minutes", params.short_break_minutes.toString())
       queryParams.append("medium_break_minutes", params.medium_break_minutes.toString())
       queryParams.append("long_break_minutes", params.long_break_minutes.toString())
       queryParams.append("long_break_after_minutes", params.long_break_after_minutes.toString())
       
       await generateSchedule.mutateAsync({
         ...params,
         end_date: params.end_date ? new Date(params.end_date).toISOString() : undefined,
       })
       // Refetch schedule after generation
       setTimeout(() => refetch(), 1000)
     } catch (err: any) {
       setError(err.response?.data?.detail || "Błąd podczas generowania harmonogramu")
     }
   }

    return (
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <Card className="mb-8 border-slate-300">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Ładowanie harmonogramu...</p>
            </CardContent>
          </Card>
        )}
        
        <div className="mb-8">
         <h1 className="text-4xl font-bold text-primary">
           Harmonogram
         </h1>
         <p className="text-muted-foreground mt-2 text-lg">
           Wyświetl i zarządzaj swoim harmonogramem nauki
         </p>
       </div>

       {error && (
         <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
           <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
           <p className="text-sm text-destructive">{error}</p>
         </div>
       )}

       {/* Controls */}
       <Card className="mb-8 border-slate-300">
         <CardContent className="pt-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex gap-2">
               <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))} size="sm">
                 ← Poprzednio
               </Button>
               <Button variant="outline" onClick={() => setCurrentDate(new Date())} size="sm">
                 Dzisiaj
               </Button>
               <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))} size="sm">
                 Dalej →
               </Button>
             </div>

             <div className="flex gap-2">
               <Button
                 variant={viewMode === "day" ? "default" : "outline"}
                 onClick={() => setViewMode("day")}
                 size="sm"
               >
                 Dzień
               </Button>
               <Button
                 variant={viewMode === "week" ? "default" : "outline"}
                 onClick={() => setViewMode("week")}
                 size="sm"
               >
                 Tydzień
               </Button>
             </div>

             <div className="flex items-center gap-2 text-foreground font-medium">
               <Calendar className="h-4 w-4 text-primary" />
               <span>
                 {format(weekStart, "MMM d", { locale: pl })} - {format(addDays(weekStart, 6), "MMM d, yyyy", { locale: pl })}
               </span>
             </div>
           </div>
         </CardContent>
       </Card>

       {/* Week View */}
       {viewMode === "week" && (
         <Card className="border-slate-300">
           {/* Week header with day names */}
           <div className="flex border-b border-slate-300">
             <div className="w-16 bg-muted/50 border-r border-slate-300 p-3 flex items-center justify-center flex-shrink-0">
               <span className="text-xs font-semibold text-foreground">Godzina</span>
             </div>
             <div className="flex flex-1">
               {weekDays.map((day, idx) => (
                 <div
                   key={idx}
                   className={`flex-1 p-3 text-center border-l border-slate-300 ${
                     isToday(day) ? "bg-primary/5" : "bg-muted/30"
                   }`}
                 >
                   <div className="font-semibold text-primary text-sm">
                     {format(day, "EEE")}
                   </div>
                   <div className={`text-sm ${isToday(day) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                     {format(day, "d MMM", { locale: pl })}
                   </div>
                 </div>
               ))}
             </div>
           </div>

             {/* Week grid - time and events */}
             <div className="flex">
               {/* Time labels column */}
               <div className="w-16 bg-muted/50 border-r border-slate-300 flex-shrink-0" style={{ height: `${getMaxDayHeight()}px` }}>
                 {Array.from({ length: 24 }, (_, i) => (
                   <div
                     key={i}
                     className="border-b border-slate-300 flex items-center justify-end pr-2"
                     style={{ height: `${HOUR_HEIGHT}px` }}
                   >
                     <span className="text-xs font-medium text-muted-foreground">
                       {`${i.toString().padStart(2, "0")}:00`}
                     </span>
                   </div>
                 ))}
               </div>

               {/* Days grid with events */}
               <div className="flex flex-1">
                {weekDays.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="flex-1 border-l border-slate-300 relative"
                    style={{ height: `${getMaxDayHeight()}px` }}
                  >
                    {/* Hour lines background */}
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-full border-b border-slate-300"
                        style={{
                          top: `${i * HOUR_HEIGHT}px`,
                          height: `${HOUR_HEIGHT}px`,
                        }}
                      />
                    ))}

                    {/* Events */}
                    {getDayEvents(day).map((event) => {
                      const startDate = parseISO(event.start_time)
                      const endDate = parseISO(event.end_time)
                      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000)

                      const startHour = startDate.getHours()
                      const startMinutes = startDate.getMinutes()
                      const pixelsPerMinute = HOUR_HEIGHT / 60
                      const topPixels = (startHour * HOUR_HEIGHT) + (startMinutes * pixelsPerMinute)
                      
                      // Use bucketed height instead of exact duration
                      const blockHeight = getHeightForDuration(durationMinutes)

                      // Check if any event starts exactly when this event ends
                      const hasEventAfter = getDayEvents(day).some(
                        (otherEvent) => parseISO(otherEvent.start_time).getTime() === endDate.getTime()
                      )

                      // Check if any event ends exactly when this event starts
                      const hasEventBefore = getDayEvents(day).some(
                        (otherEvent) => parseISO(otherEvent.end_time).getTime() === startDate.getTime()
                      )

                      let bgColor = "bg-blue-500"
                      if (event.title === "Break") {
                        bgColor = "bg-gray-400"
                      } else if (event.color === "red") {
                        bgColor = "bg-red-500"
                      } else if (event.color === "yellow") {
                        bgColor = "bg-yellow-500"
                      }

                      const margin = 2
                      const marginTopValue = hasEventBefore ? margin : 0
                      const marginBottomValue = hasEventAfter ? margin : 0
                      const totalMargin = marginTopValue + marginBottomValue

                       return (
                         <Popover open={openPopoverId === event.id} onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? event.id : null)}>
                           <PopoverTrigger asChild>
                             <div
                               key={event.id}
                               className={`absolute left-1 right-1 ${bgColor} text-white rounded p-2 text-xs cursor-pointer hover:shadow-lg transition-shadow overflow-hidden`}
                               style={{
                                 top: `${topPixels + marginTopValue}px`,
                                 height: `${blockHeight - totalMargin}px`,
                               }}
                               onMouseEnter={() => setOpenPopoverId(event.id)}
                               onMouseLeave={() => setOpenPopoverId(null)}
                             >
                               <div className="font-semibold truncate text-xs">{event.title}</div>
                               <div className="text-xs opacity-90 truncate">
                                 {getSubjectName(event.subject_id)}
                               </div>
                               <div className="text-xs opacity-75 mt-0.5">
                                 {formatTimeFromISO(event.start_time)} - {formatTimeFromISO(event.end_time)}
                               </div>
                             </div>
                           </PopoverTrigger>
                           <PopoverContent className="w-80" side="right" align="start">
                             <div className="space-y-3">
                               <div>
                                 <h4 className="font-semibold text-base text-primary">{event.title}</h4>
                                 <p className="text-sm text-muted-foreground mt-1">{getSubjectName(event.subject_id)}</p>
                               </div>
                               <div className="space-y-2 border-t border-slate-300 pt-3">
                                 <div className="flex items-center gap-2 text-sm">
                                   <Clock className="h-4 w-4 text-primary" />
                                   <span>
                                     {formatTimeFromISO(event.start_time)} - {formatTimeFromISO(event.end_time)}
                                   </span>
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                   Czas: {durationMinutes} minut
                                 </div>
                               </div>
                               {event.description && (
                                 <div className="border-t border-slate-300 pt-3">
                                   <p className="text-sm text-foreground">{event.description}</p>
                                 </div>
                               )}
                             </div>
                           </PopoverContent>
                         </Popover>
                       )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {events.length === 0 && (
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">Brak zaplanowanych zdarzeń</h3>
                <p className="text-muted-foreground">
                  Wygeneruj harmonogram lub dodaj ręcznie zdarzenia, aby zacząć
                </p>
              </CardContent>
            )}
         </Card>
       )}

      {/* Day View */}
      {viewMode === "day" && (
        <Card className="border-slate-300">
          <CardHeader>
            <CardTitle>{format(currentDate, "EEEE, MMMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {getDayEvents(currentDate).length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Brak zdarzeń dzisiaj</h3>
                    <p className="text-muted-foreground">
                      Masz wolny dzień! Zaplanuj czas nauki
                    </p>
                  </div>
                ) : (
                    getDayEvents(currentDate)
                      .sort((a: ScheduleEvent, b: ScheduleEvent) => a.start_time.localeCompare(b.start_time))
                      .map((event: ScheduleEvent) => {
                        const durationMinutes = Math.round(
                          (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 60000
                        )
                         return (
                           <div
                             key={event.id}
                             className="flex gap-4 p-4 bg-primary/5 rounded-lg border border-slate-300 hover:bg-primary/10 transition-colors"
                           >
                             <div className="flex flex-col gap-1 min-w-fit">
                               <div className="text-primary font-bold text-lg">
                                 {formatTimeFromISO(event.start_time)}
                               </div>
                               <div className="text-xs text-muted-foreground">
                                 {formatTimeFromISO(event.end_time)}
                               </div>
                             </div>
                             <div className="flex-1">
                               <h3 className="font-semibold text-foreground">{event.title}</h3>
                               <p className="text-sm text-muted-foreground mt-1">{getSubjectName(event.subject_id)}</p>
                               <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                 <Clock className="h-4 w-4" />
                                 <span>
                                   {durationMinutes} minut
                                 </span>
                               </div>
                               {event.description && (
                                 <p className="text-sm text-foreground mt-3 pt-3 border-t border-slate-300">
                                   {event.description}
                                 </p>
                               )}
                             </div>
                           </div>
                         )
                      })
                )}
            </div>
          </CardContent>
         </Card>
       )}

       {/* Floating Toolbar */}
       <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
         <div className="flex items-center gap-0 bg-secondary/95 backdrop-blur-sm rounded-lg px-1 py-1 shadow-lg border border-border">
           <Popover open={openPopoverId === 'toolbar-generate'} onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? 'toolbar-generate' : null)}>
             <PopoverTrigger asChild>
               <Button
                 size="sm"
                 variant="ghost"
                 className="h-9 px-3 hover:bg-secondary-foreground/10 text-secondary-foreground"
                 onClick={() => setShowGenerateDialog(true)}
                 onMouseEnter={() => setOpenPopoverId('toolbar-generate')}
                 onMouseLeave={() => setOpenPopoverId(null)}
                 disabled={generateSchedule.isPending}
               >
                 <Wand2 className="h-4 w-4" />
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-72" side="top" align="center">
               <div className="space-y-2">
                 <h4 className="font-semibold text-sm text-primary">Wygeneruj harmonogram</h4>
                 <p className="text-sm text-muted-foreground">
                   Automatycznie zaplanuj sesje nauki dla wybranych przedmiotów. System rozłoży zadania na dostępny czas z uwzględnieniem przerw.
                 </p>
               </div>
             </PopoverContent>
           </Popover>
         </div>
       </div>

       <GenerateScheduleDialog
         isOpen={showGenerateDialog}
         onClose={() => setShowGenerateDialog(false)}
         onGenerate={handleGenerateSchedule}
         isLoading={generateSchedule.isPending}
       />
      </div>
    )
}
