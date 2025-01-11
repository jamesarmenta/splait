import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getEmojiByName } from "@/lib/emoji";
import type { EmojiName } from "@/lib/emoji";

interface ParticipantListItemProps {
  participant: {
    id: string;
    name: string;
    emojiName: EmojiName;
  };
  onRemove: (id: string) => void;
}

const ParticipantListItem = ({
  participant,
  onRemove,
}: ParticipantListItemProps) => {
  return (
    <div className="flex items-center gap-1 p-1 pl-2 rounded-full bg-gray-50 border rounded-s-md rounded-tl-md rounded-tr-md rounded-br-md rounded-bl-md">
      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-base">
        {getEmojiByName(participant.emojiName)}
      </div>
      <span className="text-sm font-medium">{participant.name}</span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 rounded-full text-gray-400 hover:text-destructive"
        onClick={() => onRemove(participant.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ParticipantListItem;
