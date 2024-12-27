import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

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
  onEdit?: () => void;
  onDelete?: () => void;
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
  return (
    <div className="p-4 border-b border-gray-200 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-medium flex-1">{name}</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onEdit}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="w-20 text-right">
            <span className="text-sm font-semibold">${price.toFixed(2)}</span>
            {assignedTo.length > 0 && (
              <div className="text-xs text-gray-500">
                ${(price / assignedTo.length).toFixed(2)} each
              </div>
            )}
          </div>
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
              className={`h-7 px-2 ${isAssigned ? "bg-primary/10 border-primary" : ""}`}
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
