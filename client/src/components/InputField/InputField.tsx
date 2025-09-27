import * as React from "react"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type InputFieldVariant = "filled" | "outlined" | "ghost"
export type InputFieldSize = "sm" | "md" | "lg"

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputFieldVariant
  size?: InputFieldSize
  label?: string
  helperText?: string
  errorMessage?: string
  invalid?: boolean
  clearable?: boolean
  password?: boolean
  loading?: boolean
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2",
  lg: "px-4 py-3 text-lg",
}

const variantClasses = {
  outlined: "border border-border bg-background focus:ring-2 focus:ring-ring focus:border-transparent",
  filled: "bg-muted border border-transparent focus:ring-2 focus:ring-ring focus:bg-background",
  ghost: "bg-transparent border-0 border-b border-border rounded-none focus:border-primary",
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      variant = "outlined",
      size = "md",
      label,
      helperText,
      errorMessage,
      invalid = false,
      clearable = false,
      password = false,
      loading = false,
      disabled,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(value || "")
    const inputId = id || React.useId()
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onChange?.(e)
    }

    const handleClear = () => {
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>
      
      setInternalValue("")
      onChange?.(syntheticEvent)
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const inputType = password ? (showPassword ? "text" : "password") : props.type

    const hasRightIcon = clearable || password || loading
    const rightIconPadding = hasRightIcon ? "pr-10" : ""

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-2",
              disabled ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={internalValue}
            onChange={handleChange}
            disabled={disabled || loading}
            aria-invalid={invalid}
            aria-describedby={cn(
              helperText && helperId,
              errorMessage && errorId
            )}
            data-testid={`input-${inputId}`}
            className={cn(
              "w-full rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors",
              sizeClasses[size],
              variantClasses[variant],
              rightIconPadding,
              invalid && "border-destructive focus:ring-destructive",
              disabled && "cursor-not-allowed opacity-60",
              loading && "cursor-not-allowed",
              className
            )}
            {...props}
          />
          
          {hasRightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {loading && (
                <Loader2 
                  className="h-4 w-4 text-muted-foreground animate-spin" 
                  data-testid={`loading-${inputId}`}
                />
              )}
              
              {!loading && clearable && internalValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear input"
                  data-testid={`clear-${inputId}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {!loading && !clearable && password && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-testid={`password-toggle-${inputId}`}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {errorMessage && (
          <p
            id={errorId}
            className="text-xs text-destructive mt-1"
            data-testid={`error-${inputId}`}
          >
            {errorMessage}
          </p>
        )}
        
        {helperText && !errorMessage && (
          <p
            id={helperId}
            className="text-xs text-muted-foreground mt-1"
            data-testid={`helper-${inputId}`}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = "InputField"

export { InputField }
