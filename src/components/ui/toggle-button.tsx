import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ className, isSelected, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="sm"
        className={cn(
          "h-7 px-2 transition-colors",
          isSelected
            ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
            : "hover:bg-secondary",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
