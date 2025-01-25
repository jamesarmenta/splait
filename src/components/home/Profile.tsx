import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LogIn, LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Sign in to save your bills
          </span>
          <Button variant="outline" size="sm" asChild>
            <a href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
};

export default Profile;
