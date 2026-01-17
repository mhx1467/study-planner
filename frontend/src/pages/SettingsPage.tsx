import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Globe, Calendar } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePreferences } from "@/contexts/PreferencesContext"

export function SettingsPage() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { preferences, setTaskViewMode, setScheduleHoursScheme } = usePreferences()

  const languages = [
    { code: 'pl' as const, label: 'Polski' },
    { code: 'en' as const, label: 'English' },
  ]

  const viewModes = [
    { code: 'list' as const, label: t('pages.list_view') },
    { code: 'kanban' as const, label: t('pages.kanban_view') },
  ]

  const hoursSchemes = [
    { code: 'business' as const, label: t('pages.schedule.business_hours') },
    { code: 'all' as const, label: t('pages.schedule.show_all_hours') },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t('navigation.settings')}</h1>
          </div>
          <p className="text-muted-foreground mt-2">{t('pages.settings.description')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <div>
                  <CardTitle>{t('pages.settings.language')}</CardTitle>
                  <CardDescription>{t('pages.settings.language_description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    variant={language === lang.code ? 'default' : 'outline'}
                    className="transition-all"
                  >
                    {lang.label}
                    {language === lang.code && <span className="ml-2">✓</span>}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

           <Card>
             <CardHeader>
               <CardTitle>{t('pages.settings.default_task_view')}</CardTitle>
               <CardDescription>{t('pages.settings.default_task_view_description')}</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="flex flex-wrap gap-3">
                 {viewModes.map((mode) => (
                   <Button
                     key={mode.code}
                     onClick={() => setTaskViewMode(mode.code)}
                     variant={preferences.taskViewMode === mode.code ? 'default' : 'outline'}
                     className="transition-all"
                   >
                     {mode.label}
                     {preferences.taskViewMode === mode.code && <span className="ml-2">✓</span>}
                   </Button>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <div className="flex items-center gap-2">
                 <Calendar className="h-5 w-5" />
                 <div>
                   <CardTitle>{t('pages.settings.default_schedule_hours')}</CardTitle>
                   <CardDescription>{t('pages.settings.default_schedule_hours_description')}</CardDescription>
                 </div>
               </div>
             </CardHeader>
             <CardContent>
               <div className="flex flex-wrap gap-3">
                 {hoursSchemes.map((scheme) => (
                   <Button
                     key={scheme.code}
                     onClick={() => setScheduleHoursScheme(scheme.code)}
                     variant={preferences.scheduleHoursScheme === scheme.code ? 'default' : 'outline'}
                     className="transition-all"
                   >
                     {scheme.label}
                     {preferences.scheduleHoursScheme === scheme.code && <span className="ml-2">✓</span>}
                   </Button>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
