import { cn } from "@/lib/utils";
import { isEarlyStage, type Stage } from "@/services/stages";

// Étapes précoces en kraft (la seule note chaude), étapes avancées en encre bleue.
// Quelles étapes sont précoces : c'est le service qui le décide.
export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[0.8rem] font-semibold",
        isEarlyStage(stage) ? "bg-kraft text-kraft-foreground" : "bg-secondary text-secondary-foreground",
      )}
    >
      {stage}
    </span>
  );
}
