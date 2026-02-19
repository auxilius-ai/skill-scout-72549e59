import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { generateCode } from "@/lib/skills";
import { Copy, Check, Link2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GeneratePage() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const code = generateCode();
      const { error } = await supabase.from("assessments").insert({ code });
      if (error) throw error;
      setGeneratedLink(`${window.location.origin}/c/${code}`);
    } catch {
      toast({ title: "Error", description: "Failed to generate link. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Link2 className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          DevScreen
        </h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Generate a unique link for your candidate. They'll complete a short self-assessment to help you prepare for the interview.
        </p>

        {!generatedLink ? (
          <Button onClick={handleGenerate} disabled={loading} size="lg" className="px-8">
            {loading ? "Generating..." : "Generate Assessment Link"}
          </Button>
        ) : (
          <div className="animate-slide-up space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <code className="flex-1 text-xs font-mono text-foreground truncate text-left">
                {generatedLink}
              </code>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Send this link to your candidate. Once they complete the assessment, the same link will show their results.
            </p>
            <Button variant="outline" size="sm" onClick={() => { setGeneratedLink(null); setCopied(false); }}>
              Generate Another
            </Button>
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>No personal data collected. Fully anonymous.</span>
        </div>
      </div>
    </div>
  );
}
