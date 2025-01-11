import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ParticipantListItem from "./ParticipantListItem";

interface Participant {
  id: string;
  name: string;
  emoji: string;
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
    <Card className="w-full bg-white">
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
              <ParticipantListItem
                key={participant.id}
                participant={participant}
                onRemove={onRemoveParticipant}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ParticipantList;
