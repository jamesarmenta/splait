import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
}

interface ParticipantSummaryProps {
  participants?: Participant[];
  subtotal?: number;
  tax?: number;
  tip?: number;
  onTaxChange?: (value: number) => void;
  onTipChange?: (value: number) => void;
  onAddParticipant?: (name: string) => void;
  onRemoveParticipant?: (id: string) => void;
}

const defaultParticipants: Participant[] = [
  {
    id: "1",
    name: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    total: 25.5,
    items: 2,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    total: 18.75,
    items: 1,
  },
];

const ParticipantSummary = ({
  participants = defaultParticipants,
  subtotal = 44.25,
  tax = 3.54,
  tip = 8.85,
  onTaxChange = () => {},
  onTipChange = () => {},
  onAddParticipant = () => {},
  onRemoveParticipant = () => {},
}: ParticipantSummaryProps) => {
  const [newParticipantName, setNewParticipantName] = useState("");
  const total = subtotal + tax + tip;

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) return;
    onAddParticipant(newParticipantName);
    setNewParticipantName("");
  };

  return (
    <Card className="p-6 w-full h-full bg-white sticky top-4 shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add participant"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddParticipant}
            disabled={!newParticipantName}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <img
                      src={participant.avatarUrl}
                      alt={participant.name}
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-gray-500">
                      {participant.items} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">
                    ${participant.total.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-destructive"
                    onClick={() => onRemoveParticipant(participant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax">Tax</Label>
            <div className="flex items-center space-x-2 justify-between">
              <Input
                id="tax"
                type="number"
                value={tax}
                onChange={(e) => onTaxChange(parseFloat(e.target.value))}
                className="w-24"
                step="0.01"
              />
              <span className="text-gray-600">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip">Tip</Label>
            <div className="flex items-center space-x-2 justify-between">
              <Input
                id="tip"
                type="number"
                value={tip}
                onChange={(e) => onTipChange(parseFloat(e.target.value))}
                className="w-24"
                step="0.01"
              />
              <span className="text-gray-600">${tip.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParticipantSummary;
