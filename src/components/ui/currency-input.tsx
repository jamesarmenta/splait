import React, { useState, useEffect } from "react";
import CurrencyInputField from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<
    React.ComponentProps<typeof CurrencyInputField>,
    "onChange" | "value"
  > {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function CurrencyInput({
  value: initialValue,
  onChange,
  className,
  ...props
}: CurrencyInputProps) {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationClass, setValidationClass] = useState("");

  useEffect(() => {
    setValue(initialValue?.toString() ?? "");
  }, [initialValue]);

  const validateValue = (inputValue: string | undefined) => {
    if (!inputValue) {
      setValidationClass("");
      setErrorMessage("");
      return;
    }

    const numericValue = Number(inputValue);
    if (Number.isNaN(numericValue)) {
      setErrorMessage("Please enter a valid number");
      setValidationClass("border-destructive");
    } else {
      setValidationClass("border-green-500");
      setErrorMessage("");
      onChange?.(numericValue);
    }
  };

  const handleValueChange = (inputValue: string | undefined) => {
    setValue(inputValue ?? "");
    validateValue(inputValue);
  };

  return (
    <div className="relative">
      <CurrencyInputField
        value={value}
        onValueChange={handleValueChange}
        prefix="$"
        allowDecimals={true}
        decimalsLimit={2}
        decimalScale={2}
        allowNegativeValue={false}
        decimalSeparator="."
        groupSeparator=","
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          validationClass,
          className,
        )}
        {...props}
      />
      {errorMessage && (
        <div className="absolute -bottom-5 left-0 text-xs text-destructive">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
