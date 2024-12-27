import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
}

interface ParticipantListProps {
  participants?: Participant[];
  onAddParticipant?: (name: string) => void;
  onRemoveParticipant?: (id: string) => void;
}

const ParticipantList = ({
  participants = [],
  onAddParticipant = () => {},
  onRemoveParticipant = () => {},
}: ParticipantListProps) => {
  const [newParticipantName, setNewParticipantName] = useState("");

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) return;
    onAddParticipant(newParticipantName);
    setNewParticipantName("");
  };

  return (
    <Card className="p-4 w-full bg-white shadow-sm">
      <div className="space-y-4">
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

        <ScrollArea className="max-h-[120px]">
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-1 p-1 pl-2 rounded-full bg-gray-50 border"
              >
                <Avatar className="h-6 w-6">
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className="h-full w-full object-cover"
                  />
                </Avatar>
                <span className="text-sm font-medium">{participant.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full text-gray-400 hover:text-destructive"
                  onClick={() => onRemoveParticipant(participant.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ParticipantList;
