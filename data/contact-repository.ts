// Couche données : la seule couche autorisée à parler à la base.
// Les autres couches ne connaissent que le contrat `ContactRepository`
// et les types simples ci-dessous, jamais libSQL.
import { randomUUID } from "node:crypto";
import { createClient, type Row } from "@libsql/client";

export type ContactRecord = {
  id: string;
  name: string;
  company: string;
  stage: string;
  followUpDate: string | null; // jour AAAA-MM-JJ, ou null sans relance
  lastFollowUpDate: string | null; // jour AAAA-MM-JJ de la dernière relance faite
  createdAt: string; // date ISO
};

export type NewContactRecord = Pick<ContactRecord, "name" | "company" | "stage" | "followUpDate">;

// Les champs qu'une modification peut changer.
export type ContactChanges = Partial<NewContactRecord & Pick<ContactRecord, "lastFollowUpDate">>;

export interface ContactRepository {
  add(contact: NewContactRecord): Promise<ContactRecord>;
  list(): Promise<ContactRecord[]>;
  get(id: string): Promise<ContactRecord | null>;
  update(id: string, changes: ContactChanges): Promise<void>;
  remove(id: string): Promise<void>;
}

// Nom de la colonne pour chaque champ modifiable : seule cette liste peut entrer dans une requête.
const COLUMNS: Record<keyof ContactChanges, string> = {
  name: "name",
  company: "company",
  stage: "stage",
  followUpDate: "follow_up_date",
  lastFollowUpDate: "last_follow_up_date",
};

// Colonnes ajoutées après le lot 1 (lot 2 : date de relance ; lot 5 : dernière relance faite).
const ADDED_COLUMNS = ["follow_up_date", "last_follow_up_date"];

const SELECT = "SELECT id, name, company, stage, follow_up_date, last_follow_up_date, created_at FROM contacts";

function optional(value: Row[string]) {
  return value === null || value === undefined ? null : String(value);
}

function toRecord(row: Row): ContactRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    company: String(row.company),
    stage: String(row.stage),
    followUpDate: optional(row.follow_up_date),
    lastFollowUpDate: optional(row.last_follow_up_date),
    createdAt: String(row.created_at),
  };
}

// En local : un fichier SQLite à la racine du projet.
// Pour une base hébergée, définir DATABASE_URL dans `.env.local`.
const DEFAULT_URL = "file:pipeline.db";

export function createContactRepository(url = process.env.DATABASE_URL ?? DEFAULT_URL): ContactRepository {
  const client = createClient({ url });

  // La table est préparée une seule fois, au premier accès.
  let ready: Promise<void> | undefined;
  function ensureTable() {
    ready ??= (async () => {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          company TEXT NOT NULL,
          stage TEXT NOT NULL,
          created_at TEXT NOT NULL,
          follow_up_date TEXT,
          last_follow_up_date TEXT
        )
      `);
      // Une base créée par un lot précédent n'a pas toutes les colonnes : on ajoute celles qui manquent.
      const existing = (await client.execute("PRAGMA table_info(contacts)")).rows.map((column) => column.name);
      for (const column of ADDED_COLUMNS) {
        if (!existing.includes(column)) {
          await client.execute(`ALTER TABLE contacts ADD COLUMN ${column} TEXT`);
        }
      }
    })();
    return ready;
  }

  return {
    async add(contact) {
      await ensureTable();
      const record: ContactRecord = {
        ...contact,
        lastFollowUpDate: null,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await client.execute({
        sql: "INSERT INTO contacts (id, name, company, stage, follow_up_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        args: [record.id, record.name, record.company, record.stage, record.followUpDate, record.createdAt],
      });
      return record;
    },

    async list() {
      await ensureTable();
      // rowid départage deux contacts créés à la même milliseconde.
      const result = await client.execute(`${SELECT} ORDER BY created_at DESC, rowid DESC`);
      return result.rows.map(toRecord);
    },

    async get(id) {
      await ensureTable();
      const result = await client.execute({ sql: `${SELECT} WHERE id = ?`, args: [id] });
      return result.rows[0] ? toRecord(result.rows[0]) : null;
    },

    async update(id, changes) {
      const fields = (Object.keys(changes) as (keyof ContactChanges)[]).filter((field) => field in COLUMNS);
      if (fields.length === 0) return;
      await ensureTable();
      await client.execute({
        sql: `UPDATE contacts SET ${fields.map((field) => `${COLUMNS[field]} = ?`).join(", ")} WHERE id = ?`,
        args: [...fields.map((field) => changes[field] ?? null), id],
      });
    },

    async remove(id) {
      await ensureTable();
      await client.execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [id] });
    },
  };
}
