// Couche données : la seule couche autorisée à parler à la base.
// Le contrat (interface) est ce que les autres couches connaissent.
export interface ExampleRepository {
  list(): Promise<string[]>;
}

// Implémentation d'exemple : pas encore de base, renvoie une liste vide.
export function createExampleRepository(): ExampleRepository {
  return {
    async list() {
      return [];
    },
  };
}
