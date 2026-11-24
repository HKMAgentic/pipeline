import { Button } from "@/components/ui/button";
import { DateStamp } from "./date-stamp";
import type { ContactView } from "./demo-contacts";
import { StageBadge } from "./stage-badge";

export function ContactCard({ contact }: { contact: ContactView }) {
  return (
    <article className="bg-card text-card-foreground ring-border flex items-start gap-4 rounded-lg p-4 ring-1 sm:p-5">
      <div className="min-w-0 flex-1">
        <h3 className="text-xl leading-tight font-bold">{contact.name}</h3>
        <p className="text-muted-foreground mt-0.5 text-sm">{contact.company}</p>
        <div className="mt-3">
          <StageBadge stage={contact.stage} />
        </div>
        <p className="text-muted-foreground mt-3 text-sm">{contact.lastAction}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="lg">Relancer</Button>
          <Button size="lg" variant="outline">
            Étape suivante
          </Button>
        </div>
      </div>
      <DateStamp followUp={contact.followUp} />
    </article>
  );
}
