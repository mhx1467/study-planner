import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import QuizAnimation from "@/components/QuizAnimation"
import { useTranslation } from "@/hooks/useTranslation"
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
  const { t } = useTranslation()

  const features = [
    {
      titleKey: "pages.landing.feature_smart_planning.title",
      descriptionKey: "pages.landing.feature_smart_planning.description",
      icon: Calendar,
      color: "text-primary",
    },
    {
      titleKey: "pages.landing.feature_organization.title",
      descriptionKey: "pages.landing.feature_organization.description",
      icon: BookOpen,
      color: "text-secondary",
    },
    {
      titleKey: "pages.landing.feature_analytics.title",
      descriptionKey: "pages.landing.feature_analytics.description",
      icon: BarChart3,
      color: "text-primary",
    },
    {
      titleKey: "pages.landing.feature_time_management.title",
      descriptionKey: "pages.landing.feature_time_management.description",
      icon: Clock,
      color: "text-secondary",
    },
  ]

  const steps = [
    {
      number: 1,
      titleKey: "pages.landing.step_1_title",
      descriptionKey: "pages.landing.step_1_description",
    },
    {
      number: 2,
      titleKey: "pages.landing.step_2_title",
      descriptionKey: "pages.landing.step_2_description",
    },
    {
      number: 3,
      titleKey: "pages.landing.step_3_title",
      descriptionKey: "pages.landing.step_3_description",
    },
    {
      number: 4,
      titleKey: "pages.landing.step_4_title",
      descriptionKey: "pages.landing.step_4_description",
    },
  ]

   const testimonials = [
     {
       name: "Anna M.",
       role: "pages.landing.student_high_school",
       school: "pages.landing.school_university_warsaw",
       contentKey: "pages.landing.testimonial_1",
     },
     {
       name: "Piotr K.",
       role: "pages.landing.student_high_school",
       school: "pages.landing.school_liceum_curie",
       contentKey: "pages.landing.testimonial_2",
     },
     {
       name: "Maria L.",
       role: "pages.landing.student_university",
       school: "pages.landing.university_jagiellonian",
       contentKey: "pages.landing.testimonial_3",
     },
     {
       name: "Tomasz W.",
       role: "pages.landing.student_university",
       school: "pages.landing.school_warsaw_tech",
       contentKey: "pages.landing.testimonial_4",
     },
   ]

  const faqs = [
    {
      questionKey: "pages.landing.faq_q1",
      answerKey: "pages.landing.faq_a1",
    },
    {
      questionKey: "pages.landing.faq_q2",
      answerKey: "pages.landing.faq_a2",
    },
    {
      questionKey: "pages.landing.faq_q3",
      answerKey: "pages.landing.faq_a3",
    },
    {
      questionKey: "pages.landing.faq_q4",
      answerKey: "pages.landing.faq_a4",
    },
    {
      questionKey: "pages.landing.faq_q5",
      answerKey: "pages.landing.faq_a5",
    },
    {
      questionKey: "pages.landing.faq_q6",
      answerKey: "pages.landing.faq_a6",
    },
  ]

  return (
    <div className="w-full">
      <section className="relative min-h-screen bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden flex items-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-slate-300">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {t("pages.landing.feature_smart_planning.title")}
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  {t("pages.landing.hero_title")}
                  <br />
                  <span className="text-primary"></span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t("pages.landing.hero_subtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-base h-12 px-8 gap-2">
                    {t("pages.landing.cta_button")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base h-12 px-8">
                    {t("pages.landing.cta_secondary")}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {t("pages.landing.no_credit_card")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {t("pages.landing.free_access")}
                  </span>
                </div>
              </div>
            </div>

            <QuizAnimation />
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">
              {t("pages.landing.features_title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pages.landing.features_subtitle")}
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
                        <h3 className="text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
                      </div>
                      <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">
              {t("pages.landing.how_it_works_title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pages.landing.how_it_works_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{t(step.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(step.descriptionKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">
              {t("pages.landing.testimonials_title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("pages.landing.testimonials_subtitle")}
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
                          {t(testimonial.role)} • {t(testimonial.school)}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground italic">"{t(testimonial.contentKey)}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary">
              {t("pages.landing.faq_title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("pages.landing.faq_subtitle")}
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
                      <h3 className="text-lg font-semibold text-foreground">{t(faq.questionKey)}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-primary transition-transform ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFaq === idx && (
                      <p className="text-muted-foreground border-t border-slate-300 pt-4">
                        {t(faq.answerKey)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t("pages.landing.cta_section_title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("pages.landing.cta_section_description")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-base h-12 px-8 gap-2">
                {t("pages.landing.cta_button")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base h-12 px-8">
                {t("pages.landing.already_have_account")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-muted/50 border-t border-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">StudyPlanner</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("pages.landing.footer_tagline")}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t("pages.landing.footer_product")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("pages.landing.footer_features")}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("pages.landing.how_it_works_title")}
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("pages.landing.footer_opinions")}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("pages.landing.faq_title")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
