// Règles des relances : lire un jour, savoir quel jour on est, savoir si une relance est en retard.
// Un « jour » est une date du calendrier au format AAAA-MM-JJ, sans heure.

export type FollowUp = {
  date: string; // AAAA-MM-JJ
  late: boolean; // la date est passée
  daysFromToday: number; // négatif : en retard ; 0 : aujourd'hui ; positif : à venir
};

export type ParseDayResult = { ok: true; day: string } | { ok: false; error: "invalid_date" };

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDay(text: string): ParseDayResult {
  const match = DAY_PATTERN.exec(text);
  if (match) {
    const [, year, month, day] = match.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    // Un 30 février « déborde » sur mars : on le refuse.
    if (date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) {
      return { ok: true, day: text };
    }
  }
  return { ok: false, error: "invalid_date" };
}

export function todayIn(now: Date, timeZone: string): string {
  // Le format canadien anglais donne directement AAAA-MM-JJ.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dayNumber(day: string): number {
  // Calcul en UTC : pas de décalage au changement d'heure.
  return Date.parse(`${day}T00:00:00Z`) / MS_PER_DAY;
}

export function followUpStatus(date: string, today: string): FollowUp {
  const daysFromToday = dayNumber(date) - dayNumber(today);
  return { date, late: daysFromToday < 0, daysFromToday };
}
