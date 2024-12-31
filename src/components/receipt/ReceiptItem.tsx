import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Check, X } from "lucide-react";

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
    share: number;
  }>;
  participants?: Participant[];
  onAssign?: (id: string, participantId: string) => void;
  onEdit?: (id: string, updates: { name: string; price: number }) => void;
  onDelete?: (id: string) => void;
}

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
  const [editedPrice, setEditedPrice] = useState(price.toString());

  const handleSave = () => {
    if (!editedName.trim() || !editedPrice.trim()) return;
    onEdit(id, {
      name: editedName,
      price: parseFloat(editedPrice),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setEditedPrice(price.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
                placeholder="Item name"
              />
              <Input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="w-24"
                step="0.01"
                min="0"
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
                  ${price.toFixed(2)}
                </span>
                {assignedTo.length > 0 && (
                  <div className="text-xs text-gray-500">
                    ${(price / assignedTo.length).toFixed(2)} each
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {participants.map((participant) => {
          const isAssigned = assignedTo.some(
            (a) => a.participantId === participant.id,
          );
          return (
            <Button
              key={participant.id}
              variant="outline"
              size="sm"
              className={`h-7 px-2 ${
                isAssigned ? "bg-primary/10 border-primary" : ""
              }`}
              onClick={() => onAssign(id, participant.id)}
            >
              <Avatar className="h-5 w-5 mr-1">
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <span className="text-xs">{participant.name}</span>
              {isAssigned && (
                <span className="ml-1 text-xs text-gray-500">
                  ({(100 / assignedTo.length).toFixed(0)}%)
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ReceiptItem;
