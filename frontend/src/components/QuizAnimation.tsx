import { useState, useEffect } from "react"
import { Check } from "lucide-react"

const QuizAnimation = () => {
  const [stage, setStage] = useState<"quiz" | "transition" | "final">("quiz")
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [zoomOut, setZoomOut] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const questions = [
    {
      question: "Jaka jest pochodna x²?",
      options: ["2x", "x", "x³", "1"],
      correct: 0,
    },
    {
      question: "Ile to 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      question: "Jaka jest stolica Francji?",
      options: ["Londyn", "Berlin", "Paryż", "Madryt"],
      correct: 2,
    },
    {
      question: "Ile to 10 × 5?",
      options: ["40", "45", "50", "55"],
      correct: 2,
    },
  ]

  // Auto-select correct answer
  useEffect(() => {
    if (stage === "quiz" && !isAnswered) {
      const timer = setTimeout(() => {
        const correctAnswer = questions[currentQuestion].correct
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestion] = correctAnswer
        setSelectedAnswers(newAnswers)
        setIsAnswered(true)

        // Move to next question or transition
        const nextTimer = setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setIsAnswered(false)
          } else {
            // All questions answered, transition to zoom out
            setZoomOut(true)
            setTimeout(() => {
              setStage("transition")
              setZoomOut(false)
            }, 600)
          }
        }, 800)

        return () => clearTimeout(nextTimer)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [stage, currentQuestion, isAnswered, selectedAnswers, questions])

  // Handle transition to final stage
  useEffect(() => {
    if (stage === "transition") {
      const timer = setTimeout(() => {
        setStage("final")
      }, 1400)

      return () => clearTimeout(timer)
    }
  }, [stage])

  return (
    <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
      {/* Quiz Stage */}
      {stage === "quiz" && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-slate-300 overflow-hidden transition-all duration-500 ease-out ${
            zoomOut ? "scale-[0.25] opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="p-8 h-full flex flex-col justify-between bg-white dark:bg-slate-900">
            {/* Question */}
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                   Pytanie {currentQuestion + 1}/{questions.length}
                 </span>
               </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {questions[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index
                const isCorrect =
                  index === questions[currentQuestion].correct
                const showCheck = isSelected && isCorrect

                return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                          : "border-red-500 bg-red-50 dark:bg-red-950/40"
                        : "border-orange-300 dark:border-orange-700/50 bg-orange-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-slate-900 dark:text-white">
                        {option}
                      </span>
                      {showCheck && (
                        <Check
                          className="h-5 w-5 text-green-600 dark:text-green-400 animate-scale-in"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Transition Stage - Multiple Quiz Cards */}
      {stage === "transition" && (
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4 animate-fade-in">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700/50 p-4"
              style={{
                animation: `scaleIn 0.5s cubic-bezier(0.23, 1, 0.320, 1) ${idx * 0.08}s both`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-16 bg-orange-300 dark:bg-orange-700/50 rounded-full"></div>
                  <div className="h-2 w-12 bg-orange-200 dark:bg-orange-700/30 rounded-full"></div>
                </div>
                <Check className="h-6 w-6 text-green-600 dark:text-green-400 ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}

       {/* Final Stage - Success Message */}
       {stage === "final" && (
         <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
           <div className="text-center space-y-4">
             <div className="relative">
               <div className="absolute inset-0 bg-orange-300 dark:bg-orange-600 rounded-full blur-3xl animate-pulse opacity-30"></div>
               <h1 className="relative text-5xl lg:text-6xl font-bold text-orange-600 dark:text-orange-400 animate-scale-in">
                 Zdaj egzaminy
               </h1>
             </div>
             <p className="text-slate-700 dark:text-slate-300 max-w-sm mx-auto text-lg">
               Ćwicz dalej i opanujesz każdy przedmiot
             </p>
           </div>
         </div>
       )}

      {/* CSS Animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

export default QuizAnimation
