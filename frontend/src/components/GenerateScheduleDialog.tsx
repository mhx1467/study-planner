import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

interface GenerateScheduleDialogProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (params: GenerateScheduleParams) => void
  isLoading?: boolean
}

export interface GenerateScheduleParams {
  end_date?: string
  short_break_minutes: number
  medium_break_minutes: number
  long_break_minutes: number
  long_break_after_minutes: number
}

export function GenerateScheduleDialog({
   isOpen,
   onClose,
   onGenerate,
   isLoading = false,
 }: GenerateScheduleDialogProps) {
   const { t } = useTranslation()
   const [params, setParams] = useState<GenerateScheduleParams>({
    end_date: undefined,
    short_break_minutes: 5,
    medium_break_minutes: 15,
    long_break_minutes: 30,
    long_break_after_minutes: 90,
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({
      ...prev,
      [name]: name === "end_date" ? value : Math.max(1, parseInt(value) || 0),
    }))
  }

   const handleGenerate = () => {
     setError("")

     if (params.short_break_minutes < 1 || params.short_break_minutes > 60) {
       setError(t("schedule_generation.short_break_error"))
       return
     }

     if (params.medium_break_minutes < 1 || params.medium_break_minutes > 60) {
       setError(t("schedule_generation.medium_break_error"))
       return
     }

     if (params.long_break_minutes < 1 || params.long_break_minutes > 120) {
       setError(t("schedule_generation.long_break_error"))
       return
     }

     if (params.long_break_after_minutes < 15 || params.long_break_after_minutes > 480) {
       setError(t("schedule_generation.threshold_error"))
       return
     }

     onGenerate(params)
   }

  if (!isOpen) return null

   return (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
       <Card className="w-full max-w-md border-slate-300 bg-white">
         <CardHeader>
           <CardTitle>{t("dialogs.generate_schedule")}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           {error && (
             <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-2">
               <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
               <p className="text-sm text-destructive">{error}</p>
             </div>
           )}

           <div className="space-y-2">
             <label htmlFor="end_date" className="text-sm font-medium text-primary">
               {t("dialogs.end_date_label")}
             </label>
             <Input
               id="end_date"
               name="end_date"
               type="date"
               value={params.end_date || ""}
               onChange={handleInputChange}
               disabled={isLoading}
             />
             <p className="text-xs text-muted-foreground">
               {t("dialogs.end_date_help")}
             </p>
           </div>

           <div className="space-y-4">
             <div className="border-t border-slate-300 pt-4">
               <p className="text-sm font-semibold text-primary mb-3">{t("dialogs.break_settings_label")}</p>

               <div className="space-y-3">
                 <div className="space-y-1">
                   <label htmlFor="short_break" className="text-sm text-foreground">
                     {t("dialogs.short_break_label")}
                   </label>
                   <Input
                     id="short_break"
                     name="short_break_minutes"
                     type="number"
                     min="1"
                     max="60"
                     value={params.short_break_minutes}
                     onChange={handleInputChange}
                     disabled={isLoading}
                   />
                   <p className="text-xs text-muted-foreground">
                     {t("dialogs.short_break_help")}
                   </p>
                 </div>

                 <div className="space-y-1">
                   <label htmlFor="medium_break" className="text-sm text-foreground">
                     {t("dialogs.medium_break_label")}
                   </label>
                   <Input
                     id="medium_break"
                     name="medium_break_minutes"
                     type="number"
                     min="1"
                     max="60"
                     value={params.medium_break_minutes}
                     onChange={handleInputChange}
                     disabled={isLoading}
                   />
                   <p className="text-xs text-muted-foreground">
                     {t("dialogs.medium_break_help")}
                   </p>
                 </div>

                 <div className="space-y-1">
                   <label htmlFor="long_break" className="text-sm text-foreground">
                     {t("dialogs.long_break_label")}
                   </label>
                   <Input
                     id="long_break"
                     name="long_break_minutes"
                     type="number"
                     min="1"
                     max="120"
                     value={params.long_break_minutes}
                     onChange={handleInputChange}
                     disabled={isLoading}
                   />
                   <p className="text-xs text-muted-foreground">
                     {t("dialogs.long_break_help")}
                   </p>
                 </div>

                 <div className="space-y-1">
                   <label htmlFor="long_break_threshold" className="text-sm text-foreground">
                     {t("dialogs.threshold_label")}
                   </label>
                   <Input
                     id="long_break_threshold"
                     name="long_break_after_minutes"
                     type="number"
                     min="15"
                     max="480"
                     step="15"
                     value={params.long_break_after_minutes}
                     onChange={handleInputChange}
                     disabled={isLoading}
                   />
                   <p className="text-xs text-muted-foreground">
                     {t("dialogs.threshold_help")}
                   </p>
                 </div>
               </div>
             </div>
           </div>

           <div className="flex gap-2 justify-end pt-4">
             <Button
               variant="outline"
               onClick={onClose}
               disabled={isLoading}
             >
               {t("buttons.cancel")}
             </Button>
             <Button
               onClick={handleGenerate}
               disabled={isLoading}
             >
               {isLoading ? t("dialogs.generating") : t("dialogs.generate_button")}
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
   )
}
