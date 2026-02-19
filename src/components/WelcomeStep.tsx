import { Button } from "@/components/ui/button";
import { Shield, MessageSquare, Clock } from "lucide-react";

interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="animate-fade-in text-center max-w-xl mx-auto">
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <MessageSquare className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Interview Preparation
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          This short self-assessment helps your interviewer focus on the topics most relevant to you.
          It's not a test — there are no right or wrong answers.
        </p>
      </div>

      <div className="grid gap-4 text-left mb-8">
        <div className="flex gap-3 p-4 rounded-lg bg-card border border-border">
          <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm text-foreground">Completely anonymous</p>
            <p className="text-sm text-muted-foreground">No personal data is collected. No names, emails, cookies, or tracking.</p>
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-lg bg-card border border-border">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm text-foreground">Guide the conversation</p>
            <p className="text-sm text-muted-foreground">Your ratings help structure the interview around your strengths.</p>
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-lg bg-card border border-border">
          <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm text-foreground">Takes about 5 minutes</p>
            <p className="text-sm text-muted-foreground">Rate your experience level across key technical areas.</p>
          </div>
        </div>
      </div>

      <Button onClick={onStart} size="lg" className="px-8">
        Begin Assessment
      </Button>
    </div>
  );
}
