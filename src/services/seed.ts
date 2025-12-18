import { initDb } from './db';
import seed from '../data/perfumes_seed.json';

type SeedPerfume = {
  id: string;
  brand: string;
  name: string;
  concentration?: string;
  gender?: string;
  year?: number;
  notes?: string[];
  season?: string[];
  occasion?: string[];
  intensity?: string;
  longevity?: number;
};

export async function seedDbIfEmpty() {
  const db = await initDb();

  const row = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM perfumes;');
  const count = row?.c ?? 0;
  if (count > 0) return { seeded: false, count };

  const items = seed as unknown as SeedPerfume[];

  await db.withTransactionAsync(async () => {
    const stmt = await db.prepareAsync(`
      INSERT INTO perfumes (
        id, brand, name, concentration, gender, year, intensity, longevity,
        notes_json, season_json, occasion_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    try {
      for (const p of items) {
        await stmt.executeAsync([
          p.id,
          p.brand,
          p.name,
          p.concentration ?? null,
          p.gender ?? null,
          p.year ?? null,
          p.intensity ?? null,
          p.longevity ?? null,
          JSON.stringify(p.notes ?? []),
          JSON.stringify(p.season ?? []),
          JSON.stringify(p.occasion ?? []),
        ]);
      }
    } finally {
      await stmt.finalizeAsync();
    }
  });

  const row2 = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM perfumes;');
  return { seeded: true, count: row2?.c ?? items.length };
}
