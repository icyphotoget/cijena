import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'parfemai.db';

export async function getDb() {
  // Async API (Expo SQLite)
  return SQLite.openDatabaseAsync(DB_NAME);
}

export async function initDb() {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS perfumes (
      id TEXT PRIMARY KEY NOT NULL,
      brand TEXT NOT NULL,
      name TEXT NOT NULL,
      concentration TEXT,
      gender TEXT,
      year INTEGER,
      intensity TEXT,
      longevity INTEGER,

      notes_json TEXT,
      season_json TEXT,
      occasion_json TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_perfumes_brand ON perfumes(brand);
    CREATE INDEX IF NOT EXISTS idx_perfumes_name ON perfumes(name);
  `);

  return db;
}
