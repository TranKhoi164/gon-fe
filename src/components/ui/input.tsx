import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full h-10 px-3.5 py-2 text-sm rounded-md bg-surface-secondary text-text-primary border border-border placeholder:text-text-tertiary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
