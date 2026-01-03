import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
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
       setFormError("Proszę wypełnić wszystkie pola")
       return
     }

     try {
       await login(formData)
       navigate("/dashboard")
     } catch (err) {
       console.error("Login error:", err)
     }
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl -z-10"></div>
      
      <Card className="w-full max-w-md border-slate-300">
         <CardHeader className="space-y-2">
           <div className="flex items-center justify-center gap-2 mb-4">
           </div>
           <CardTitle className="text-center">StudyPlanner</CardTitle>
           <CardDescription className="text-center">
             Zaloguj się na swoje konto, aby kontynuować
           </CardDescription>
         </CardHeader>

        <CardContent>
          {(error || formError) && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error || formError}</p>
            </div>
          )}

           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium text-primary">
                 Email
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
               <label htmlFor="password" className="text-sm font-medium text-primary">
                 Hasło
               </label>
               <Input
                 id="password"
                 type="password"
                 name="password"
                 placeholder="Wpisz swoje hasło"
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
               {isLoading ? "Logowanie..." : "Zaloguj się"}
             </Button>
           </form>

           <div className="mt-4 text-center text-sm">
             <span className="text-muted-foreground">Nie masz konta? </span>
             <Link to="/register" className="text-primary hover:underline font-medium">
               Zarejestruj się
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
