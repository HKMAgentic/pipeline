// Met en forme pour le tampon le résultat calculé par le service.
// Aucun calcul de retard ici : `late` et `daysFromToday` viennent de services/follow-up.
import type { FollowUp } from "@/services/follow-up";
import type { FollowUpView } from "./date-stamp";

// Le jour est une date du calendrier : on le lit et l'écrit en UTC pour ne pas changer de jour.
function longDate(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function plural(count: number, word: string) {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

export function toFollowUpView(followUp: FollowUp): FollowUpView {
  const [, month, day] = followUp.date.split("-");
  const when = longDate(followUp.date); // ex. « jeudi 26 novembre »
  const view = { late: followUp.late, date: `${day}·${month}` };

  if (followUp.late) {
    const days = -followUp.daysFromToday;
    return {
      ...view,
      caption: `−${plural(days, "jour").toUpperCase()}`,
      label: `Relance en retard de ${plural(days, "jour")}, prévue le ${when}`,
    };
  }
  if (followUp.daysFromToday === 0) {
    return { ...view, caption: "AUJOURD’HUI", label: `Relance prévue aujourd’hui, ${when}` };
  }
  return { ...view, caption: when.split(" ")[0].toUpperCase(), label: `Relance prévue le ${when}` };
}
