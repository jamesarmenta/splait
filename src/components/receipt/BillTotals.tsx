import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Button } from "@/components/ui/button";

interface BillTotalsProps {
  subtotal: number;
  tax: number;
  tip: number;
  tipPercentage?: number;
  onTaxChange: (value: number) => void;
  onTipChange: (value: number, percentage?: number) => void;
}

const TIP_PERCENTAGES = [10, 15, 18, 20];

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const BillTotals = ({
  subtotal,
  tax,
  tip,
  tipPercentage,
  onTaxChange,
  onTipChange,
}: BillTotalsProps) => {
  const total = subtotal + tax + tip;
  const [currentTipPercentage, setCurrentTipPercentage] = useState(
    tipPercentage || Math.round((tip / subtotal) * 100) || 15,
  );

  const handleTipAmountChange = (value: number) => {
    const percentage = subtotal > 0 ? Math.round((value / subtotal) * 100) : 0;
    setCurrentTipPercentage(percentage);
    onTipChange(value, percentage);
  };

  const handleTipPercentageClick = (percentage: number) => {
    setCurrentTipPercentage(percentage);
    const newTip = (subtotal * percentage) / 100;
    onTipChange(newTip, percentage);
  };

  const adjustTipByOnePercent = (increment: boolean) => {
    if (subtotal === 0) return;

    // Round to 1 decimal place to avoid floating point issues
    const currentPercent = Math.round((tip / subtotal) * 1000) / 10;

    // If at a whole number, add/subtract 1, otherwise round to nearest whole number in desired direction
    const newPercent = increment
      ? Number.isInteger(currentPercent)
        ? currentPercent + 1
        : Math.ceil(currentPercent)
      : Number.isInteger(currentPercent)
        ? currentPercent - 1
        : Math.floor(currentPercent);

    const newTip = (subtotal * newPercent) / 100;
    setCurrentTipPercentage(newPercent);
    onTipChange(newTip, newPercent);
  };

  return (
    <Card className="p-6 w-full flex flex-row gap-4">
      <div className="flex flex-col grow gap-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-lg font-semibold font-title">Subtotal</span>
          <span className="text-lg font-semibold font-title">
            ${formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label htmlFor="tax" className="text-sm">
              <span className="text-lg font-semibold font-title">Tax</span>
            </Label>
            <span className="text-lg font-semibold font-title">
              ${formatCurrency(tax)}
            </span>
          </div>
          <div className="flex items-center gap-2 justify-between">
            <CurrencyInput
              id="tax"
              value={tax}
              onChange={onTaxChange}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tip" className="text-sm">
              <span className="text-lg font-semibold font-title">
                Tip (
                {subtotal > 0 ? ((tip / subtotal) * 100).toFixed(1) : "0.0"}%)
              </span>
            </Label>
            <span className="text-lg font-semibold font-title">
              ${formatCurrency(tip)}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <CurrencyInput
              value={tip}
              onChange={handleTipAmountChange}
              className="w-24"
            />
            <div className="w-full px-8 flex gap-2 items-center">
              <Button
                variant="clickable"
                size="sm"
                className="h-8 px-2"
                onClick={() => adjustTipByOnePercent(false)}
                disabled={subtotal === 0}
              >
                -1%
              </Button>
              {TIP_PERCENTAGES.map((percent) => (
                <ToggleButton
                  key={percent}
                  isSelected={currentTipPercentage === percent}
                  className="flex-1 text-sm"
                  onClick={() => handleTipPercentageClick(percent)}
                >
                  {percent}%
                </ToggleButton>
              ))}
              <Button
                variant="clickable"
                size="sm"
                className="h-8 px-2"
                onClick={() => adjustTipByOnePercent(true)}
                disabled={subtotal === 0}
              >
                +1%
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-lg font-semibold font-title">Total</span>
          <span className="text-lg font-semibold font-title">
            ${formatCurrency(total)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default BillTotals;
