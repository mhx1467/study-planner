import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AlertCircle, Home } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const { showSuccess, showError } = useToast()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [formError, setFormError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError("")

      if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
        setFormError(t("forms.fill_all_fields"))
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError(t("forms.passwords_dont_match"))
        return
      }

      if (formData.password.length < 6) {
        setFormError(t("forms.password_min_length"))
        return
      }

       try {
         await register({
           email: formData.email,
           username: formData.username,
           password: formData.password,
         })
         showSuccess(t("auth.account_created_title"), t("auth.account_created_message"))
         navigate("/dashboard")
       } catch (err: any) {
        const errorMsg = err.response?.data?.detail || t("auth.registration_failed")
        showError(t("auth.registration_error"), errorMsg)
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
            <CardTitle className="text-center">{t("auth.create_account")}</CardTitle>
            <CardDescription className="text-center">
              {t("auth.register_description")}
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
                  placeholder="twojaemail@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-primary">
                  {t("forms.username")}
                </label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder={t("forms.choose_username")}
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-primary">
                    {t("forms.password")}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {t("forms.password_min_chars")}
                  </p>
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">
                  {t("forms.confirm_password")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder={t("forms.confirm_password_placeholder")}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("auth.creating_account") : t("auth.register")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">{t("auth.already_have_account")} </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t("auth.login")}
              </Link>
            </div>
         </CardContent>
       </Card>
    </div>
  )
}
