import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "white-outline"
    | "gradient-primary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  withGradientOverlay?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      withGradientOverlay = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden";

    const variantClasses = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
      secondary:
        "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500",
      ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
      "white-outline":
        "bg-white border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300",
      "gradient-primary":
        "bg-gradient-to-r from-[#7077FE] to-[#F07EFF] hover:from-[#7077FE] hover:to-[#7077FE] text-white",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-4 text-[18px] font-[Plus_Jakarta_Sans] font-medium",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          withGradientOverlay && "group",
          className
        )}
        disabled={isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {withGradientOverlay && (
          <span
            className="absolute inset-0 
            bg-gradient-to-r from-[#7077FE] to-[#F07EFF] 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 ease-in-out"
          />
        )}
        {isLoading ? (
          <span className="inline-flex items-center relative z-10">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          <div className="relative z-10 jakarta flex items-center gap-2">
            {children}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
