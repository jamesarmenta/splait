import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getEmojiByName, type EmojiName } from "@/lib/emoji";

const JOIN_EMOJI_OPTIONS: EmojiName[] = [
  "heart",
  "apple",
  "rainbow",
  "pizza",
  "happy",
  "baloon",
  "star",
  "tree",
  "fire",
];

interface JoinBillProps {
  onJoinBill: (code: string[]) => void;
}

const JoinBill = ({ onJoinBill }: JoinBillProps) => {
  const [selectedEmojis, setSelectedEmojis] = useState<EmojiName[]>([]);

  const handleEmojiClick = (emojiName: EmojiName) => {
    if (selectedEmojis.includes(emojiName)) {
      setSelectedEmojis(selectedEmojis.filter((e) => e !== emojiName));
    } else if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emojiName]);
    }
  };

  const handleBackspace = () => {
    setSelectedEmojis(selectedEmojis.slice(0, -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmojis.length === 3) {
      onJoinBill(selectedEmojis);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold font-title">Join a Bill</h2>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-2 justify-center w-full">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-full h-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl"
              >
                {selectedEmojis[index] ? (
                  getEmojiByName(selectedEmojis[index])
                ) : (
                  <span className="text-muted-foreground text-sm"></span>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            {JOIN_EMOJI_OPTIONS.map((emojiName) => (
              <Button
                key={emojiName}
                type="button"
                variant=""
                className="w-full h-16 p-0 text-3xl bg-gray-200"
                onClick={() => handleEmojiClick(emojiName)}
              >
                {getEmojiByName(emojiName)}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant=""
            className="w-full bg-gray-200"
            disabled={selectedEmojis.length === 0}
            onClick={handleBackspace}
          >
            Backspace
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default JoinBill;
