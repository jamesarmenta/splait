import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: Array<{
    participantId: string;
    share: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  total: number;
  items: number;
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
        return {
          name: item.name,
          amount: item.price * (assignment?.share || 0),
        };
      });
  };

  const getParticipantShare = (participant: Participant) => {
    if (subtotal === 0) return 0;
    return participant.total / subtotal;
  };

  return (
    <Card className="p-6 w-full bg-white">
      <ScrollArea className="max-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
          {participants.map((participant) => {
            const participantItems = getParticipantItems(participant.id);
            const sharePercentage = getParticipantShare(participant);
            const participantTax = tax * sharePercentage;
            const participantTip = tip * sharePercentage;
            const participantTotal =
              participant.total + participantTax + participantTip;

            return (
              <div
                key={participant.id}
                className="flex flex-col p-4 rounded-lg bg-olive-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={participant.avatarUrl}
                      alt={participant.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  <span className="text-primary font-semibold">
                    ${participantTotal.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {participantItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span className="truncate mr-2">{item.name}</span>
                      <span>${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {(participantTax > 0 || participantTip > 0) && (
                    <>
                      <Separator className="my-2" />
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${participant.total.toFixed(2)}</span>
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
