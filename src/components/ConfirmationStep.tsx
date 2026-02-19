import { CheckCircle2 } from "lucide-react";

export function ConfirmationStep() {
  return (
    <div className="animate-fade-in text-center max-w-md mx-auto py-8">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">Thank You!</h2>
      <p className="text-muted-foreground leading-relaxed mb-2">
        Your self-assessment has been submitted. Your interviewer will use this to tailor the conversation to your experience.
      </p>
      <p className="text-sm text-muted-foreground">
        You can close this tab — no further action is needed.
      </p>
    </div>
  );
}
