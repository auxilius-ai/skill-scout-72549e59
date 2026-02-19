import { type SkillCategory, type RatingLevel, type LastUsed, RATING_LABELS, LAST_USED_LABELS, getSkillByKey } from "@/lib/skills";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface RatingRow {
  skill_key: string;
  rating: RatingLevel;
  last_used: LastUsed | null;
}

interface CapabilityRow {
  skill_key: string;
  capability_index: number;
  selected: boolean;
}

interface ResultsViewProps {
  categories: SkillCategory[];
  ratings: RatingRow[];
  capabilities: CapabilityRow[];
  createdAt: string;
}

const ratingColorMap: Record<RatingLevel, string> = {
  none: "bg-rating-none/15 text-muted-foreground",
  basic: "bg-rating-basic/15",
  intermediate: "bg-rating-intermediate/15",
  advanced: "bg-rating-advanced/15",
  expert: "bg-rating-expert/15",
};

export function ResultsView({ categories, ratings, capabilities, createdAt }: ResultsViewProps) {
  const ratingMap = new Map(ratings.map((r) => [r.skill_key, r]));
  const capMap = new Map<string, number[]>();
  capabilities.filter((c) => c.selected).forEach((c) => {
    if (!capMap.has(c.skill_key)) capMap.set(c.skill_key, []);
    capMap.get(c.skill_key)!.push(c.capability_index);
  });

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-1">Assessment Results</h1>
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Completed {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const hasAny = cat.skills.some((s) => {
            const r = ratingMap.get(s.key);
            return r && r.rating !== "none";
          });
          if (!hasAny) return null;

          return (
            <div key={cat.category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.skills.map((skill) => {
                  const r = ratingMap.get(skill.key);
                  if (!r || r.rating === "none") return null;
                  const selectedCaps = capMap.get(skill.key) || [];
                  const skillDef = getSkillByKey(skill.key);

                  return (
                    <div key={skill.key} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          {r.last_used && (
                            <span className="text-[10px] text-muted-foreground">
                              {LAST_USED_LABELS[r.last_used]}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${ratingColorMap[r.rating]}`}
                            style={{ color: `hsl(var(--rating-${r.rating}))` }}
                          >
                            {RATING_LABELS[r.rating]}
                          </span>
                        </div>
                      </div>
                      {selectedCaps.length > 0 && skillDef && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedCaps.map((idx) => {
                            const cap = skillDef.capabilities.find((c) => c.index === idx);
                            return cap ? (
                              <Badge key={idx} variant="secondary" className="text-[11px] font-normal">
                                {cap.text}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
