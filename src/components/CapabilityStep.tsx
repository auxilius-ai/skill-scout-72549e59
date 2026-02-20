import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { type Skill, type RatingLevel, RATING_LABELS } from "@/lib/skills";

export interface CapabilityData {
  [skillKey: string]: {
    [capIndex: number]: boolean;
  };
}

interface CapabilityStepProps {
  skills: { skill: Skill; rating: RatingLevel }[];
  capabilities: CapabilityData;
  onChange: (skillKey: string, capIndex: number, selected: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CapabilityStep({ skills, capabilities, onChange, onNext, onBack }: CapabilityStepProps) {
  if (skills.length === 0) {
    return (
      <div className="animate-fade-in text-center max-w-xl mx-auto">
        <p className="text-muted-foreground mb-6">
          No skills rated Intermediate or above — you can skip this step.
        </p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">Specific Capabilities</h2>
        <p className="text-sm text-muted-foreground">
          For skills you rated Intermediate or above, check the capabilities that apply.
        </p>
      </div>

      <div className="space-y-6">
        {skills.map(({ skill, rating }) => (
          <div key={skill.key} className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-sm text-foreground">{skill.name}</span>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rating-${rating}/15 text-rating-${rating}`}
                style={{
                  backgroundColor: `hsl(var(--rating-${rating}) / 0.12)`,
                  color: `hsl(var(--rating-${rating}))`,
                }}
              >
                {RATING_LABELS[rating]}
              </span>
            </div>
            <div className="space-y-2">
              {skill.capabilities.map((cap) => {
                const checked = capabilities[skill.key]?.[cap.index] ?? false;
                return (
                  <label
                    key={cap.index}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => onChange(skill.key, cap.index, !!v)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-foreground leading-snug">{cap.text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Submit Assessment</Button>
      </div>
    </div>
  );
}
