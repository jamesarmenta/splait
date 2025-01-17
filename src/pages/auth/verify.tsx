import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold font-title">Check your email</h1>
          <p className="text-muted-foreground">
            We sent you a verification link. Please check your email and click
            the link to verify your account.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/auth/login")}
          >
            Back to Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
}
