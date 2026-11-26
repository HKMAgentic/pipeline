// Les étapes du pipeline, dans l'ordre.
export const STAGES = ["À contacter", "Contacté", "Échange", "Proposition", "Signé"] as const;
export type Stage = (typeof STAGES)[number];

export const INITIAL_STAGE: Stage = "À contacter";

export function isStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}

// L'étape d'après, ou null après la dernière (« Signé »).
export function nextStage(stage: Stage): Stage | null {
  return STAGES[STAGES.indexOf(stage) + 1] ?? null;
}

// Étapes précoces : le contact n'a pas encore vraiment échangé.
const EARLY_STAGES: readonly Stage[] = ["À contacter", "Contacté"];

export function isEarlyStage(stage: Stage): boolean {
  return EARLY_STAGES.includes(stage);
}
