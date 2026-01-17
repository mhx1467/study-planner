import * as React from "react"

interface ToggleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  labelLeft?: string
  labelRight?: string
  className?: string
}

export const ToggleSwitch = React.forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  ({ checked, onCheckedChange, label, labelLeft, labelRight, className = "" }, ref) => {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {labelLeft && (
          <span className={`text-sm font-medium transition-colors ${
            !checked ? "text-primary font-semibold" : "text-muted-foreground"
          }`}>
            {labelLeft}
          </span>
        )}
        
        <button
          ref={ref}
          onClick={() => onCheckedChange(!checked)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            checked ? "bg-orange-600" : "bg-slate-200"
          }`}
          role="switch"
          aria-checked={checked}
          aria-label={label}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
              checked ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>

        {labelRight && (
          <span className={`text-sm font-medium transition-colors ${
            checked ? "text-primary font-semibold" : "text-muted-foreground"
          }`}>
            {labelRight}
          </span>
        )}
      </div>
    )
  }
)

ToggleSwitch.displayName = "ToggleSwitch"
