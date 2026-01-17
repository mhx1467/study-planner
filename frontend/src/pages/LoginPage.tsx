import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AlertCircle, Home } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { showSuccess, showError } = useToast()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formError, setFormError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError("")

      if (!formData.email || !formData.password) {
        setFormError(t("forms.fill_all_fields"))
        return
      }

       try {
         await login(formData)
         showSuccess(t("auth.login_success_title"), t("auth.login_success_message"))
         navigate("/dashboard")
        } catch (err) {
         const errorMsg = (err as any).response?.data?.detail || t("auth.login_failed")
         showError(t("auth.login_error"), errorMsg)
        }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl -z-10"></div>
        
         <Button
           variant="outline"
           size="icon"
           className="absolute top-4 left-4 rounded-full"
           onClick={() => navigate("/")}
           title={t("common.back_to_home")}
         >
           <Home className="h-5 w-5" />
         </Button>
        
        <Card className="w-full max-w-md border-slate-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
            </div>
            <CardTitle className="text-center">StudyPlanner</CardTitle>
            <CardDescription className="text-center">
              {t("auth.login_description")}
            </CardDescription>
          </CardHeader>

        <CardContent>
          {(formError) && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-primary">
                  {t("forms.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-primary">
                  {t("forms.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t("forms.enter_password")}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("auth.logging_in") : t("auth.login")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">{t("auth.no_account")} </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t("auth.register")}
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
