import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SkillCategory, type RatingLevel, type LastUsed, RATING_LABELS, LAST_USED_LABELS, RATING_LEVELS } from "@/lib/skills";

export interface SkillRatingData {
  [skillKey: string]: {
    rating: RatingLevel;
    lastUsed?: LastUsed;
  };
}

interface SkillRatingStepProps {
  categories: SkillCategory[];
  ratings: SkillRatingData;
  onChange: (skillKey: string, field: "rating" | "lastUsed", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SkillRatingStep({ categories, ratings, onChange, onNext, onBack }: SkillRatingStepProps) {
  return (
    <div className="animate-slide-in-right max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">Rate Your Experience</h2>
        <p className="text-sm text-muted-foreground">Select your experience level and when you last used each technology.</p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.category}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
              {cat.category}
            </h3>
            <div className="space-y-2">
              {cat.skills.map((skill) => {
                const data = ratings[skill.key] || { rating: "none" as RatingLevel };
                return (
                  <div
                    key={skill.key}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-card border border-border"
                  >
                    <span className="font-medium text-sm text-foreground min-w-[120px]">{skill.name}</span>
                    <div className="flex flex-1 gap-2">
                      <Select
                        value={data.rating}
                        onValueChange={(v) => onChange(skill.key, "rating", v)}
                      >
                        <SelectTrigger className="flex-1 text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RATING_LEVELS.map((level) => (
                            <SelectItem key={level} value={level} className="text-xs">
                              {RATING_LABELS[level]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {data.rating !== "none" && (
                        <Select
                          value={data.lastUsed || ""}
                          onValueChange={(v) => onChange(skill.key, "lastUsed", v)}
                        >
                          <SelectTrigger className="flex-1 text-xs h-9">
                            <SelectValue placeholder="Last used..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(LAST_USED_LABELS) as LastUsed[]).map((key) => (
                              <SelectItem key={key} value={key} className="text-xs">
                                {LAST_USED_LABELS[key]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}
