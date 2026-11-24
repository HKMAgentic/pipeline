import { cn } from "@/lib/utils";
import type { ContactView } from "./demo-contacts";

// Le geste signature de Cachet : la date de relance imprimée comme un tampon dateur.
// Deux encres seulement : bleu à l'heure, rouge en retard.
export function DateStamp({ followUp, className }: { followUp: ContactView["followUp"]; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={followUp.label}
      className={cn(
        "size-[88px] shrink-0 font-heading font-bold",
        followUp.late ? "text-stamp-late rotate-6" : "text-stamp -rotate-9",
        className,
      )}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="50" y="33" fontSize="10.5" letterSpacing="1.5" textAnchor="middle" fill="currentColor">
        {followUp.late ? "EN RETARD" : "RELANCE"}
      </text>
      <text x="50" y="59" fontSize="22" textAnchor="middle" fill="currentColor">
        {followUp.date}
      </text>
      <text x="50" y="75" fontSize="9.5" letterSpacing="1.2" textAnchor="middle" fill="currentColor">
        {followUp.caption}
      </text>
    </svg>
  );
}
