import { cn } from "@/lib/utils";
import type { Stage } from "./demo-contacts";

// Étapes précoces en kraft (la seule note chaude), étapes avancées en encre bleue.
const EARLY: Stage[] = ["À contacter", "Contacté"];

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[0.8rem] font-semibold",
        EARLY.includes(stage) ? "bg-kraft text-kraft-foreground" : "bg-secondary text-secondary-foreground",
      )}
    >
      {stage}
    </span>
  );
}
