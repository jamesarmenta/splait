import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleButton } from "@/components/ui/toggle-button";

interface BillTotalsProps {
  subtotal: number;
  tax: number;
  tip: number;
  tipPercentage?: number;
  onTaxChange: (value: number) => void;
  onTipChange: (value: number, percentage?: number) => void;
}

const TIP_PERCENTAGES = [10, 15, 18, 20];

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

const BillTotals = ({
  subtotal,
  tax,
  tip,
  tipPercentage,
  onTaxChange,
  onTipChange,
}: BillTotalsProps) => {
  const total = roundToTwoDecimals(subtotal + tax + tip);
  const [tipMode, setTipMode] = useState<"percentage" | "amount">("percentage");
  const [currentTipPercentage, setCurrentTipPercentage] = useState(
    tipPercentage || Math.round((tip / subtotal) * 100) || 15,
  );

  // Update tip when subtotal changes and we're in percentage mode
  useEffect(() => {
    if (tipMode === "percentage" && subtotal > 0) {
      const newTip = roundToTwoDecimals(
        (subtotal * currentTipPercentage) / 100,
      );
      onTipChange(newTip, currentTipPercentage);
    }
  }, [subtotal, currentTipPercentage, tipMode]);

  const handleTipPercentageChange = (percentage: number) => {
    setCurrentTipPercentage(percentage);
    const newTip = roundToTwoDecimals((subtotal * percentage) / 100);
    onTipChange(newTip, percentage);
  };

  const handleTipAmountChange = (amount: number) => {
    setTipMode("amount");
    onTipChange(roundToTwoDecimals(amount));
  };

  const handleTaxChange = (value: string) => {
    const amount = roundToTwoDecimals(parseFloat(value) || 0);
    onTaxChange(amount);
  };

  const handleTipModeChange = (mode: "percentage" | "amount") => {
    setTipMode(mode);
    if (mode === "percentage") {
      const percentage = currentTipPercentage;
      const newTip = roundToTwoDecimals((subtotal * percentage) / 100);
      onTipChange(newTip, percentage);
    } else {
      onTipChange(roundToTwoDecimals(tip));
    }
  };

  return (
    <Card className="p-6 w-full flex flex-row gap-4">
      <div className="flex flex-col grow gap-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-lg font-semibold font-title">Subtotal</span>
          <span className="text-lg font-semibold font-title">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tax" className="text-sm">
            <span className="text-lg font-semibold font-title">Tax</span>
          </Label>
          <div className="flex items-center gap-2 justify-between">
            <Input
              id="tax"
              type="number"
              value={tax}
              onChange={(e) => handleTaxChange(e.target.value)}
              className="w-24"
              step="0.01"
              min="0"
            />
            <span className="text-lg font-semibold font-title">
              ${tax.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tip" className="text-sm">
              <span className="text-lg font-semibold mb-4 font-title">Tip</span>
            </Label>
            <Tabs
              value={tipMode}
              onValueChange={(v) =>
                handleTipModeChange(v as "percentage" | "amount")
              }
            >
              <TabsList className="h-8">
                <TabsTrigger value="percentage" className="text-xs">
                  Percentage
                </TabsTrigger>
                <TabsTrigger value="amount" className="text-xs">
                  Amount
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {tipMode === "percentage" ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {TIP_PERCENTAGES.map((percent) => (
                  <ToggleButton
                    key={percent}
                    isSelected={currentTipPercentage === percent}
                    className="flex-1 text-sm"
                    onClick={() => handleTipPercentageChange(percent)}
                  >
                    {percent}%
                  </ToggleButton>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={currentTipPercentage}
                    onChange={(e) =>
                      handleTipPercentageChange(parseFloat(e.target.value) || 0)
                    }
                    className="w-20"
                    min="0"
                    step="1"
                  />
                  <span className="text-base font-semibold font-title">%</span>
                </div>
                <span className="text-lg font-semibold font-title">
                  ${tip.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-between">
              <Input
                type="number"
                value={tip}
                onChange={(e) =>
                  handleTipAmountChange(parseFloat(e.target.value) || 0)
                }
                className="w-24"
                step="0.01"
                min="0"
              />
              <span className="text-lg font-semibold font-title">
                ${tip.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-lg font-semibold font-title">Total</span>
          <span className="text-lg font-semibold font-title">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default BillTotals;
