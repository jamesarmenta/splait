import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface CreateBillProps {
  onCreateBill: () => void;
}

const CreateBill = ({ onCreateBill }: CreateBillProps) => {
  const { user } = useAuth();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold font-title">Start a Bill</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          onClick={onCreateBill}
          className="h-16 text-lg"
          variant="clickable"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          <div className="flex flex-col items-start text-left">
            <span className="text-base">Start from Scratch</span>
            {!user && (
              <span className="text-xs text-muted-foreground">
                Sign in required
              </span>
            )}
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-16 text-lg"
          size="lg"
          disabled={true}
          title="Coming soon!"
        >
          <Camera className="mr-2 h-5 w-5" />
          <div className="flex flex-col items-start text-left">
            <span className="text-base">Start from Photo</span>
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default CreateBill;
