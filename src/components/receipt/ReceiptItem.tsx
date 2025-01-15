import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2, Check, X } from "lucide-react";
import ParticipantButton from "./ParticipantButton";

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface ReceiptItemProps {
  id?: string;
  name?: string;
  price?: number;
  assignedTo?: Array<{
    participantId: string;
    portions: number;
  }>;
  participants?: Participant[];
  onAssign?: (id: string, participantId: string, portions?: number) => void;
  onEdit?: (id: string, updates: { name: string; price: number }) => void;
  onDelete?: (id: string) => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ReceiptItem = ({
  id = "1",
  name = "Sample Item",
  price = 10.99,
  assignedTo = [],
  participants = [],
  onAssign = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: ReceiptItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedPrice, setEditedPrice] = useState(price);

  const getTotalPortions = useCallback(() => {
    return assignedTo.reduce((sum, a) => sum + a.portions, 0);
  }, [assignedTo]);

  const handlePortionChange = (participantId: string, delta: number) => {
    const assignment = assignedTo.find(
      (a) => a.participantId === participantId,
    );
    if (!assignment) {
      // If not assigned, assign with initial portion
      onAssign(id, participantId, Math.max(1, delta));
    } else {
      // Update portions, remove if going to 0
      const newPortions = Math.max(0, assignment.portions + delta);
      onAssign(id, participantId, newPortions);
    }
  };

  const getParticipantShare = (participantId: string) => {
    const assignment = assignedTo.find(
      (a) => a.participantId === participantId,
    );
    if (!assignment) return 0;

    const totalPortions = getTotalPortions();
    if (totalPortions === 0) return 0;

    return (assignment.portions / totalPortions) * 100;
  };

  const handleSave = () => {
    if (!editedName.trim()) return;
    if (editedName.length > 50) return;
    onEdit(id, {
      name: editedName,
      price: editedPrice,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setEditedPrice(price);
    setIsEditing(false);
  };

  return (
    <Card>
      <div className="text-card-foreground p-4 rounded-md bg-inherit">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1"
                  placeholder="Item name"
                  maxLength={50}
                />
                <CurrencyInput
                  value={editedPrice}
                  onChange={setEditedPrice}
                  className="w-24"
                  placeholder="Price"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-green-500"
                  onClick={handleSave}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  onClick={handleCancel}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <span className="text-base font-medium flex-1 font-title">
                  {name}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="w-20 text-right">
                  <span className="text-base font-semibold font-title">
                    ${formatCurrency(price)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => {
            const isAssigned = assignedTo.some(
              (a) => a.participantId === participant.id,
            );
            const portions =
              assignedTo.find((a) => a.participantId === participant.id)
                ?.portions || 0;
            const share = getParticipantShare(participant.id);

            return (
              <ParticipantButton
                key={participant.id}
                participant={participant}
                isAssigned={isAssigned}
                portions={portions}
                share={share}
                onAssign={() => onAssign(id, participant.id, 1)}
                onPortionChange={(delta) =>
                  handlePortionChange(participant.id, delta)
                }
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ReceiptItem;
