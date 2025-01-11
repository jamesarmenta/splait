import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEmojiByName } from "@/lib/emoji";
import type { EmojiName } from "@/lib/emoji";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    portions: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  emojiName: EmojiName;
}

interface ParticipantSummariesProps {
  participants: Participant[];
  items: ReceiptItem[];
  tax: number;
  tip: number;
}

const ParticipantSummaries = ({
  participants,
  items,
  tax,
  tip,
}: ParticipantSummariesProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  const getParticipantItems = (participantId: string) => {
    return items
      .filter((item) =>
        item.assignedTo.some((a) => a.participantId === participantId),
      )
      .map((item) => {
        const assignment = item.assignedTo.find(
          (a) => a.participantId === participantId,
        );
        const totalPortions = item.assignedTo.reduce(
          (sum, a) => sum + a.portions,
          0,
        );
        const portions = assignment?.portions || 0;
        const amount =
          totalPortions > 0 ? (item.price * portions) / totalPortions : 0;

        return {
          name: item.name,
          portions,
          totalPortions,
          amount,
        };
      });
  };

  const getParticipantTotal = (participantId: string) => {
    const items = getParticipantItems(participantId);
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const getParticipantShare = (participantTotal: number) => {
    if (subtotal === 0) return 0;
    return participantTotal / subtotal;
  };

  return (
    <Card className="p-6 w-full bg-card">
      <ScrollArea className="max-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
          {participants.map((participant) => {
            const participantItems = getParticipantItems(participant.id);
            const participantTotal = getParticipantTotal(participant.id);
            const sharePercentage = getParticipantShare(participantTotal);
            const participantTax = tax * sharePercentage;
            const participantTip = tip * sharePercentage;
            const total = participantTotal + participantTax + participantTip;

            return (
              <div
                key={participant.id}
                className="flex flex-col p-4 rounded-lg bg-card border shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-base">
                      {getEmojiByName(participant.emojiName)}
                    </div>
                    <span className="font-medium text-foreground">
                      {participant.name}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {participantItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span className="truncate mr-2">
                        {item.name}
                        {item.totalPortions > 1 && (
                          <span className="text-xs text-muted-foreground/70 ml-1">
                            ({item.portions}/{item.totalPortions} portions)
                          </span>
                        )}
                      </span>
                      <span>${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {(participantTax > 0 || participantTip > 0) && (
                    <>
                      <Separator className="my-2" />
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${participantTotal.toFixed(2)}</span>
                        </div>
                        {participantTax > 0 && (
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${participantTax.toFixed(2)}</span>
                          </div>
                        )}
                        {participantTip > 0 && (
                          <div className="flex justify-between">
                            <span>Tip</span>
                            <span>${participantTip.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ParticipantSummaries;
