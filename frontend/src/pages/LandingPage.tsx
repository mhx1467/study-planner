import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import QuizAnimation from "@/components/QuizAnimation"
import {
  BookOpen,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      title: "Inteligentne planowanie nauki",
      description: "Stwórz harmonogram dostosowany do Twojego tempa nauki, priorytetów i dostępnego czasu.",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Organizacja przedmiotów",
      description: "Zarządzaj wszystkimi przedmiotami w jednym miejscu i automatycznie śledź postępy w nauce.",
      icon: BookOpen,
      color: "text-secondary",
    },
    {
      title: "Analiza postępów",
      description: "Analizuj swoje nawyki nauki dzięki czytelnym statystykom i wskaźnikom efektywności.",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      title: "Zarządzanie czasem",
      description: "Nie przegap żadnego terminu dzięki inteligentnym przypomnieniom i zaplanowanym zadaniom.",
      icon: Clock,
      color: "text-secondary",
    },
  ]

  const steps = [
    {
      number: 1,
      title: "Utwórz swoje przedmioty",
      description: "Dodaj wszystkie przedmioty i kursy, aby rozpocząć planowanie nauki.",
    },
    {
      number: 2,
      title: "Dodaj zadania",
      description: "Wprowadź zadania, egzaminy i cele wraz z terminami oraz priorytetami.",
    },
    {
      number: 3,
      title: "Wygeneruj harmonogram",
      description: "Pozwól StudyPlannerowi stworzyć zoptymalizowany harmonogram dostosowany do Ciebie.",
    },
    {
      number: 4,
      title: "Monitoruj postępy i osiągaj cele",
      description: "Śledź wyniki, modyfikuj zadania i konsekwentnie realizuj swoje cele edukacyjne.",
    },
  ]

  const testimonials = [
    {
      name: "Anna M.",
      role: "Studentka",
      school: "Uniwersytet Warszawski",
      content:
        "StudyPlanner całkowicie zmienił sposób, w jaki zarządzam swoim czasem. Generator harmonogramu oszczędza mi kilka godzin tygodniowo.",
    },
    {
      name: "Piotr K.",
      role: "Uczeń szkoły średniej",
      school: "Liceum Imienia Marii Curie",
      content:
        "System priorytetów i filtrowania zadań pomaga mi skupić się na tym, co naprawdę ważne. Moje wyniki znacznie się poprawiły.",
    },
    {
      name: "Maria L.",
      role: "Doktorantka",
      school: "Uniwersytet Jagielloński",
      content:
        "Zarządzanie kilkoma projektami jednocześnie było przytłaczające, dopóki nie zaczęłam korzystać ze StudyPlanner. Widok harmonogramu jest bardzo intuicyjny.",
    },
    {
      name: "Tomasz W.",
      role: "Student Uniwersytetu",
      school: "Politechnika Warszawska",
      content:
        "Panel statystyk dokładnie pokazuje, gdzie faktycznie poświęcam czas. To jak osobisty trener nauki.",
    },
  ]

  const faqs = [
    {
      question: "Jak działa generowanie harmonogramu?",
      answer:
        "StudyPlanner analizuje Twoje przedmioty, zadania, terminy oraz dostępny czas, aby stworzyć optymalny harmonogram. Uwzględnia priorytety, złożoność zadań oraz Twoje wcześniejsze tempo nauki.",
    },
    {
      question: "Czy mogę edytować zadania po ich utworzeniu?",
      answer:
        "Tak. Możesz w dowolnym momencie edytować, przesuwać lub usuwać zadania, a harmonogram automatycznie dostosuje się do zmian.",
    },
    {
      question: "Czy aplikacja działa na urządzeniach mobilnych?",
      answer:
        "Tak. StudyPlanner jest w pełni responsywny i działa na komputerach, tabletach oraz smartfonach. Dane synchronizują się automatycznie.",
    },
    {
      question: "Jak działa system priorytetów?",
      answer:
        "Zadania możesz oznaczyć jako niskiego, średniego lub wysokiego priorytetu. System wykorzystuje te informacje do odpowiedniego rozplanowania czasu nauki.",
    },
    {
      question: "Czy mogę udostępniać swój harmonogram innym?",
      answer:
        "Obecnie harmonogramy są prywatne, jednak możliwy jest eksport danych i ich udostępnienie. Funkcje współpracy są planowane.",
    },
    {
      question: "Czym StudyPlanner różni się od innych aplikacji?",
      answer:
        "StudyPlanner nie tylko porządkuje zadania, ale aktywnie pomaga tworzyć realny, dopasowany harmonogram nauki oparty na Twoich preferencjach i dostępnym czasie.",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden flex items-center">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-slate-300">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Inteligentne planowanie nauki</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  Ucz się mądrze,
                  <br />
                  <span className="text-primary">nie ciężej</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Stwórz efektywny harmonogram nauki w kilka minut. StudyPlanner organizuje Twoje przedmioty, śledzi postępy i pomaga osiągać cele edukacyjne w prosty i skuteczny sposób.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-base h-12 px-8 gap-2">
                    Zacznij za darmo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base h-12 px-8">
                    Zaloguj się
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">Nie wymagana karta płatnicza</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">Darmowy dostęp</span>
                </div>
              </div>
            </div>

            {/* Right illustration - Quiz Animation */}
            <QuizAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">
              Wszystko, czego potrzebujesz do skutecznej nauki
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nowoczesne narzędzia stworzone z myślą o studentach, którzy chcą lepiej zarządzać czasem i osiągać lepsze wyniki.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="border-slate-300 hover:border-slate-300 transition-colors">
                  <CardContent className="pt-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">Jak to działa – prosto i skutecznie</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Zacznij w kilka minut i zmień sposób, w jaki się uczysz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Testimonials Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">Co mówią studenci</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Opinie studentów z czołowych polskich uczelni, którzy korzystają ze StudyPlanner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-slate-300 hover:border-slate-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.school}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground italic">"{testimonial.content}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">Często zadawane pytania</h2>
            <p className="text-lg text-muted-foreground">
              Wszystko, co warto wiedzieć o StudyPlanner.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="border-slate-300 cursor-pointer hover:border-slate-300 transition-colors"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-primary transition-transform ${openFaq === idx ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                    {openFaq === idx && (
                      <p className="text-muted-foreground border-t border-slate-300 pt-4">{faq.answer}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Gotowy, aby zmienić sposób nauki?
            </h2>
            <p className="text-xl text-muted-foreground">
              Dołącz do tysięcy studentów, którzy korzystają ze StudyPlanner, aby skuteczniej osiągać swoje cele akademickie.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-base h-12 px-8 gap-2">
                Zacznij za darmo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base h-12 px-8">
                Masz już konto? Zaloguj się
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">StudyPlanner</span>
              </div>
              <p className="text-sm text-muted-foreground">Ucz się mądrzej, nie ciężej.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Funkcje
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    Jak to działa
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                    Opinie
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    Pytania
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2026 StudyPlanner. Wszystkie prawa zastrzeżone.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#twitter" className="hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#github" className="hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="#discord" className="hover:text-primary transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
