import { getDb, initDb } from './db';

export type Perfume = {
  id: string;
  brand: string;
  name: string;
  concentration: string | null;
  gender: string | null;
  year: number | null;
  intensity: string | null;
  longevity: number | null;
  notes: string[];
  season: string[];
  occasion: string[];
};

function mapRow(row: any): Perfume {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    concentration: row.concentration ?? null,
    gender: row.gender ?? null,
    year: row.year ?? null,
    intensity: row.intensity ?? null,
    longevity: row.longevity ?? null,
    notes: safeJsonArray(row.notes_json),
    season: safeJsonArray(row.season_json),
    occasion: safeJsonArray(row.occasion_json),
  };
}

function safeJsonArray(v: any): string[] {
  if (typeof v !== 'string') return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function getAllPerfumes(): Promise<Perfume[]> {
  await initDb();
  const db = await getDb();
  const rows = await db.getAllAsync<any>('SELECT * FROM perfumes ORDER BY brand, name;');
  return rows.map(mapRow);
}

export async function searchPerfumes(q: string, limit = 50): Promise<Perfume[]> {
  await initDb();
  const db = await getDb();
  const qq = `%${q.trim()}%`;
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM perfumes WHERE brand LIKE ? OR name LIKE ? ORDER BY brand, name LIMIT ?;',
    [qq, qq, limit]
  );
  return rows.map(mapRow);
}

export async function getPerfumeById(id: string): Promise<Perfume | null> {
  await initDb();
  const db = await getDb();
  const row = await db.getFirstAsync<any>('SELECT * FROM perfumes WHERE id = ?;', [id]);
  return row ? mapRow(row) : null;
}
