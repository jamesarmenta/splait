import React from "react";
import { Button } from "@/components/ui/button";
import { getEmojiByName } from "@/lib/emoji";
import type { EmojiName } from "@/lib/emoji";

interface ParticipantButtonProps {
  participant: {
    id: string;
    name: string;
    emojiName: EmojiName;
  };
  isAssigned: boolean;
  portions: number;
  share: number;
  onAssign: () => void;
  onPortionChange: (delta: number) => void;
}

const ParticipantButton = ({
  participant,
  isAssigned,
  portions,
  onAssign,
  onPortionChange,
}: ParticipantButtonProps) => {
  const handleClick = () => {
    if (isAssigned) {
      onPortionChange(-portions); // Subtract current portions to remove assignment
    } else {
      onAssign(); // Add new assignment with default portion (1)
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-7 px-2 transition-colors bg-clickable ${isAssigned ? "bg-slate-800 hover:bg-slate-700 border-slate-700" : "hover:bg-secondary"}`}
      onClick={handleClick}
    >
      <span className="mr-1 text-sm">
        {getEmojiByName(participant.emojiName)}
      </span>
      <span className={`text-sm ${isAssigned ? "text-white" : ""}`}>
        {participant.name}
      </span>
    </Button>
  );
};

export default ParticipantButton;
