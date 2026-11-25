// Couche données : la seule couche autorisée à parler à la base.
// Les autres couches ne connaissent que le contrat `ContactRepository`
// et les types simples ci-dessous, jamais libSQL.
import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";

export type ContactRecord = {
  id: string;
  name: string;
  company: string;
  stage: string;
  createdAt: string; // date ISO
};

export type NewContactRecord = Pick<ContactRecord, "name" | "company" | "stage">;

export interface ContactRepository {
  add(contact: NewContactRecord): Promise<ContactRecord>;
  list(): Promise<ContactRecord[]>;
}

// En local : un fichier SQLite à la racine du projet.
// Pour une base hébergée, définir DATABASE_URL dans `.env.local`.
const DEFAULT_URL = "file:pipeline.db";

export function createContactRepository(url = process.env.DATABASE_URL ?? DEFAULT_URL): ContactRepository {
  const client = createClient({ url });

  // La table est créée une seule fois, au premier accès.
  let ready: Promise<unknown> | undefined;
  function ensureTable() {
    ready ??= client.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        stage TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    return ready;
  }

  return {
    async add(contact) {
      await ensureTable();
      const record: ContactRecord = { ...contact, id: randomUUID(), createdAt: new Date().toISOString() };
      await client.execute({
        sql: "INSERT INTO contacts (id, name, company, stage, created_at) VALUES (?, ?, ?, ?, ?)",
        args: [record.id, record.name, record.company, record.stage, record.createdAt],
      });
      return record;
    },

    async list() {
      await ensureTable();
      // rowid départage deux contacts créés à la même milliseconde.
      const result = await client.execute(
        "SELECT id, name, company, stage, created_at FROM contacts ORDER BY created_at DESC, rowid DESC",
      );
      return result.rows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        company: String(row.company),
        stage: String(row.stage),
        createdAt: String(row.created_at),
      }));
    },
  };
}
