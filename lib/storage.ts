import { openDB, type IDBPDatabase, type DBSchema } from "idb";

// ─── Schema ────────────────────────────────────────────────────────────────
export interface MapProject {
  id: string;
  name: string;
  transcript: string;
  mermaid: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edges: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[];
  createdAt: number;
  updatedAt: number;
}

interface AudiomapDB extends DBSchema {
  projects: {
    key: string;
    value: MapProject;
    indexes: { "by-updated": number };
  };
}

// ─── DB singleton ──────────────────────────────────────────────────────────
let dbPromise: Promise<IDBPDatabase<AudiomapDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<AudiomapDB>("audiomap-db-v1", 1, {
      upgrade(db) {
        const store = db.createObjectStore("projects", { keyPath: "id" });
        store.createIndex("by-updated", "updatedAt");
      },
    });
  }
  return dbPromise;
}

// ─── API ───────────────────────────────────────────────────────────────────
export async function saveProject(
  project: Omit<MapProject, "createdAt" | "updatedAt">
): Promise<MapProject> {
  const db = await getDb();
  const now = Date.now();
  const existing = await db.get("projects", project.id);
  const record: MapProject = {
    ...project,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await db.put("projects", record);
  return record;
}

export async function getProjects(): Promise<MapProject[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex("projects", "by-updated");
  return all.reverse(); // Most recent first
}

export async function getProject(id: string): Promise<MapProject | undefined> {
  const db = await getDb();
  return db.get("projects", id);
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("projects", id);
}

export async function renameProject(id: string, name: string): Promise<void> {
  const db = await getDb();
  const project = await db.get("projects", id);
  if (!project) return;
  await db.put("projects", { ...project, name, updatedAt: Date.now() });
}
