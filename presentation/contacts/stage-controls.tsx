"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StageError } from "@/services/contacts";
import { nextStage, STAGES, type Stage } from "@/services/stages";
import type { CardActions } from "./card-actions";

export type StageFormState = { error: StageError | null };
export type StageAction = (state: StageFormState, formData: FormData) => Promise<StageFormState>;

const MESSAGES: Record<StageError, string> = {
  not_found: "Ce contact n’existe plus. Rechargez la page.",
  last_stage: "Ce contact est déjà à la dernière étape.",
  invalid_stage: "Cette étape n’existe pas. Choisissez-en une dans la liste.",
};

type StageControlsProps = {
  contactId: string;
  stage: Stage;
  actions: Pick<CardActions, "advanceStage" | "changeStage">;
  initialState?: StageFormState;
};

// « Étape suivante » (absent à la dernière étape) et la liste de toutes les étapes.
export function StageControls({ contactId, stage, actions, initialState = { error: null } }: StageControlsProps) {
  const [advanceState, advance, advancing] = useActionState(actions.advanceStage, initialState);
  const [changeState, change, changing] = useActionState(actions.changeStage, { error: null });
  const next = nextStage(stage); // décision du service
  const error = advanceState.error ?? changeState.error;

  // Choisir une étape l'enregistre tout de suite.
  function choose(value: Stage | null) {
    if (!value || value === stage) return;
    const formData = new FormData();
    formData.set("id", contactId);
    formData.set("etape", value);
    startTransition(() => change(formData));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {next && (
        <form action={advance}>
          <Input type="hidden" name="id" value={contactId} />
          <Button type="submit" variant="outline" disabled={advancing} aria-label={`Étape suivante : ${next}`}>
            Étape suivante
          </Button>
        </form>
      )}
      <Select name="etape" value={stage} onValueChange={choose} disabled={changing}>
        <SelectTrigger aria-label="Changer d’étape" className="bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p role="alert" className="text-destructive w-full text-sm">
          {MESSAGES[error]}
        </p>
      )}
    </div>
  );
}
