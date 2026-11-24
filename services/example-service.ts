// Couche service : les règles métier. Elle ne connaît que le contrat
// de la couche données, jamais la base elle-même.
import type { ExampleRepository } from "@/data/example-repository";

export async function listExamples(repository: ExampleRepository): Promise<string[]> {
  return repository.list();
}
