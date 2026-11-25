// Les étapes du pipeline, dans l'ordre.
export const STAGES = ["À contacter", "Contacté", "Échange", "Proposition", "Signé"] as const;
export type Stage = (typeof STAGES)[number];

export const INITIAL_STAGE: Stage = "À contacter";

export function isStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}
