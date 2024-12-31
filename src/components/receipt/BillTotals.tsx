import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BillTotalsProps {
  subtotal: number;
  tax: number;
  taxPercentage: number;
  tip: number;
  onTaxChange: (value: number, percentage: number) => void;
  onTipChange: (value: number) => void;
}

const TIP_PERCENTAGES = [10, 15, 18, 20];

const BillTotals = ({
  subtotal,
  tax,
  taxPercentage,
  tip,
  onTaxChange,
  onTipChange,
}: BillTotalsProps) => {
  const total = subtotal + tax + tip;
  const [tipMode, setTipMode] = useState<"percentage" | "amount">("percentage");
  const [tipPercentage, setTipPercentage] = useState(
    subtotal > 0 ? Math.round((tip / subtotal) * 100) : 15
  );

  const handleTipPercentageChange = (percentage: number) => {
    setTipPercentage(percentage);
    onTipChange((subtotal * percentage) / 100);
  };

  const handleTipAmountChange = (amount: number) => {
    onTipChange(amount);
    if (subtotal > 0) {
      setTipPercentage(Math.round((amount / subtotal) * 100));
    }
  };

  const handleTaxChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const percentage = subtotal > 0 ? (amount / subtotal) * 100 : 0;
    onTaxChange(amount, percentage);
  };

  return (
    <Card className="p-6 w-full bg-card">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-lg font-semibold mb-4 font-title">
            Subtotal
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax" className="text-sm">
            <span className="text-lg font-semibold mb-4 font-title">Tax</span>
          </Label>
          <div className="flex items-center gap-2 justify-between">
            <Input
              id="tax"
              type="number"
              value={tax}
              onChange={(e) => handleTaxChange(e.target.value)}
              className="w-24"
              step="0.01"
            />
            <span className="text-sm text-gray-600">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tip" className="text-sm">
              <span className="text-lg font-semibold mb-4 font-title">Tip</span>
            </Label>
            <Tabs
              value={tipMode}
              onValueChange={(v) => setTipMode(v as "percentage" | "amount")}
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
            <div className="space-y-2">
              <div className="flex gap-2">
                {TIP_PERCENTAGES.map((percent) => (
                  <Button
                    key={percent}
                    variant={tipPercentage === percent ? "default" : "outline"}
                    className="flex-1 text-sm"
                    onClick={() => handleTipPercentageChange(percent)}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tipPercentage}
                    onChange={(e) =>
                      handleTipPercentageChange(parseFloat(e.target.value))
                    }
                    className="w-20"
                  />
                  <span className="text-sm">%</span>
                </div>
                <span className="text-sm text-gray-600">${tip.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-between">
              <Input
                type="number"
                value={tip}
                onChange={(e) =>
                  handleTipAmountChange(parseFloat(e.target.value))
                }
                className="w-24"
                step="0.01"
              />
              <span className="text-sm text-gray-600">${tip.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-lg font-semibold mb-4 font-title">Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default BillTotals;
