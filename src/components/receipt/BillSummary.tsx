import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
}

interface BillSummaryProps {
  participants?: Participant[];
  tax?: number;
  tip?: number;
  onTaxChange?: (value: number) => void;
  onTipChange?: (value: number) => void;
}

const BillSummary = ({
  participants = [],
  tax = 0,
  tip = 0,
  onTaxChange = () => {},
  onTipChange = () => {},
}: BillSummaryProps) => {
  const subtotal = participants.reduce((sum, p) => sum + p.total, 0);
  const total = subtotal + tax + tip;

  return (
    <Card className="p-6 w-full bg-white shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="font-medium">{participant.name}</span>
            </div>
            <span className="text-primary font-semibold">
              ${participant.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax" className="text-sm">
            Tax
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="tax"
              type="number"
              value={tax}
              onChange={(e) => onTaxChange(parseFloat(e.target.value))}
              className="w-24"
              step="0.01"
            />
            <span className="text-sm text-gray-600">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip" className="text-sm">
            Tip
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="tip"
              type="number"
              value={tip}
              onChange={(e) => onTipChange(parseFloat(e.target.value))}
              className="w-24"
              step="0.01"
            />
            <span className="text-sm text-gray-600">${tip.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default BillSummary;
