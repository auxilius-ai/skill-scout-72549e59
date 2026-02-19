import { Shield, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          DevScreen
        </h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          A lightweight, anonymous technical screening tool for developer candidates. Candidates complete a short self-assessment via a unique link to help interviewers prepare.
        </p>
        <p className="text-muted-foreground text-sm">
          Questions? Reach out at{" "}
          <a
            href="mailto:recruiting@auxilius.ai"
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            recruiting@auxilius.ai
          </a>
        </p>
      </div>
    </div>
  );
};

export default Index;
