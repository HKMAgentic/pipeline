// Contacts FICTIFS pour montrer l'écran. Ils seront remplacés par les vrais
// contacts quand la couche données sera branchée.

export const STAGES = ["À contacter", "Contacté", "Échange", "Proposition", "Signé"] as const;
export type Stage = (typeof STAGES)[number];

export type ContactView = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  lastAction: string;
  followUp: {
    late: boolean;
    date: string; // ex. « 26·11 »
    caption: string; // ex. « JEUDI » ou « −4 JOURS »
    label: string; // phrase complète pour les lecteurs d'écran
  };
};

export const demoContacts: ContactView[] = [
  {
    id: "demo-1",
    name: "Hugo Bernard",
    company: "Studio Lumen · photographie",
    stage: "Contacté",
    lastAction: "Premier appel le 10 nov.",
    followUp: {
      late: true,
      date: "20·11",
      caption: "−4 JOURS",
      label: "Relance en retard de 4 jours, prévue le vendredi 20 novembre",
    },
  },
  {
    id: "demo-2",
    name: "Camille Roux",
    company: "Atelier Roux · menuiserie",
    stage: "Proposition",
    lastAction: "Devis envoyé le 18 nov.",
    followUp: { late: false, date: "26·11", caption: "JEUDI", label: "Relance prévue le jeudi 26 novembre" },
  },
  {
    id: "demo-3",
    name: "Inès Moreau",
    company: "Maison Moreau · traiteur",
    stage: "À contacter",
    lastAction: "Recommandée par Camille Roux",
    followUp: { late: false, date: "02·12", caption: "MERCREDI", label: "Relance prévue le mercredi 2 décembre" },
  },
];
