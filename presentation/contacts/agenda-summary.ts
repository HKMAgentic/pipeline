// Texte du bandeau, à partir des comptes calculés par le service (buildAgenda).
export function agendaSummary({ dueCount, lateCount }: { dueCount: number; lateCount: number }) {
  if (dueCount === 0) return "Aucune relance à faire aujourd’hui";
  const due = `${dueCount} relance${dueCount > 1 ? "s" : ""} à faire`;
  return lateCount > 0 ? `${due}, dont ${lateCount} en retard` : due;
}
