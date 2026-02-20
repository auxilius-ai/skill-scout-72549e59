import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSkillCategories, type RatingLevel, type LastUsed } from "@/lib/skills";
import { ProgressStepper } from "@/components/ProgressStepper";
import { WelcomeStep } from "@/components/WelcomeStep";
import { SkillRatingStep, type SkillRatingData } from "@/components/SkillRatingStep";
import { CapabilityStep, type CapabilityData } from "@/components/CapabilityStep";
import { ConfirmationStep } from "@/components/ConfirmationStep";
import { ResultsView } from "@/components/ResultsView";
import { Loader2 } from "lucide-react";

const STEPS = [
  { label: "Welcome" },
  { label: "Skills" },
  { label: "Details" },
  { label: "Done" },
];

export default function AssessmentPage() {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const categories = getSkillCategories();
  const [ratings, setRatings] = useState<SkillRatingData>({});
  const [capabilities, setCapabilities] = useState<CapabilityData>({});

  // For results view
  const [savedRatings, setSavedRatings] = useState<any[]>([]);
  const [savedCapabilities, setSavedCapabilities] = useState<any[]>([]);
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (!code) return;
    loadAssessment();
  }, [code]);

  const loadAssessment = async () => {
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("code", code!)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setCreatedAt(data.created_at);

    if (data.completed_at) {
      // Load results
      const [ratingsRes, capsRes] = await Promise.all([
        supabase.from("skill_ratings").select("*").eq("assessment_code", code!),
        supabase.from("capability_selections").select("*").eq("assessment_code", code!),
      ]);
      setSavedRatings(ratingsRes.data || []);
      setSavedCapabilities(capsRes.data || []);
      setCompleted(true);
    }

    setLoading(false);
  };

  const handleRatingChange = (skillKey: string, field: "rating" | "lastUsed", value: string) => {
    setRatings((prev) => ({
      ...prev,
      [skillKey]: {
        ...prev[skillKey],
        rating: prev[skillKey]?.rating || "none",
        [field === "lastUsed" ? "lastUsed" : "rating"]: value,
      },
    }));
  };

  const handleCapabilityChange = (skillKey: string, capIndex: number, selected: boolean) => {
    setCapabilities((prev) => ({
      ...prev,
      [skillKey]: { ...prev[skillKey], [capIndex]: selected },
    }));
  };

  const getEligibleSkills = () => {
    const eligible: RatingLevel[] = ["intermediate", "advanced", "expert"];
    return categories.flatMap((cat) =>
      cat.skills
        .filter((s) => eligible.includes(ratings[s.key]?.rating as RatingLevel))
        .map((s) => ({ skill: s, rating: ratings[s.key]?.rating as RatingLevel }))
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Save skill ratings
      const ratingRows = Object.entries(ratings)
        .filter(([, v]) => v.rating !== "none")
        .map(([skillKey, v]) => ({
          assessment_code: code!,
          skill_key: skillKey,
          rating: v.rating,
          last_used: v.lastUsed || null,
        }));

      if (ratingRows.length > 0) {
        const { error } = await supabase.from("skill_ratings").insert(ratingRows);
        if (error) throw error;
      }

      // Save capability selections
      const capRows: { assessment_code: string; skill_key: string; capability_index: number; selected: boolean }[] = [];
      for (const [skillKey, caps] of Object.entries(capabilities)) {
        for (const [idx, selected] of Object.entries(caps)) {
          capRows.push({
            assessment_code: code!,
            skill_key: skillKey,
            capability_index: Number(idx),
            selected: !!selected,
          });
        }
      }

      if (capRows.length > 0) {
        const { error } = await supabase.from("capability_selections").insert(capRows);
        if (error) throw error;
      }

      // Mark assessment as complete
      const { error } = await supabase
        .from("assessments")
        .update({ completed_at: new Date().toISOString() })
        .eq("code", code!);
      if (error) throw error;

      setCurrentStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Assessment Not Found</h1>
          <p className="text-muted-foreground text-sm">This link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background p-4 py-12">
        <ResultsView
          categories={categories}
          ratings={savedRatings}
          capabilities={savedCapabilities}
          createdAt={createdAt}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <ProgressStepper steps={STEPS} currentStep={currentStep} />

        {currentStep === 0 && (
          <WelcomeStep onStart={() => setCurrentStep(1)} />
        )}

        {currentStep === 1 && (
          <SkillRatingStep
            categories={categories}
            ratings={ratings}
            onChange={handleRatingChange}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && (
          <CapabilityStep
            skills={getEligibleSkills()}
            capabilities={capabilities}
            onChange={handleCapabilityChange}
            onNext={handleSubmit}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && <ConfirmationStep />}
      </div>
    </div>
  );
}
