import type { Perfume } from './perfumesRepo';
import { getAllPerfumes } from './perfumesRepo';

export type VibeId = 'fresh' | 'office' | 'date' | 'night' | 'winter' | 'minimal';

export type Vibe = { id: VibeId; title: string; subtitle: string };

export const VIBES: Vibe[] = [
  { id: 'fresh', title: 'Fresh & Clean', subtitle: 'svježe, lagano, daily' },
  { id: 'office', title: 'Office-safe', subtitle: 'sigurno za posao i ured' },
  { id: 'date', title: 'Date night', subtitle: 'privlačno, cozy, close-range' },
  { id: 'night', title: 'Night out', subtitle: 'glasnije, projekcija, party' },
  { id: 'winter', title: 'Winter warm', subtitle: 'slatko/ambar/začini za hladno' },
  { id: 'minimal', title: 'Minimal & Elegant', subtitle: 'čisto, elegantno, nenapadno' },
];

function hasAny(arr: string[] | undefined, wanted: string[]) {
  if (!Array.isArray(arr)) return false;
  return wanted.some((w) => arr.includes(w));
}

export async function getPerfumesForVibe(vibeId: VibeId): Promise<Perfume[]> {
  const all = await getAllPerfumes();

  switch (vibeId) {
    case 'fresh':
      return all.filter(
        (p) =>
          hasAny(p.notes, ['citrus', 'morsko', 'bergamot', 'limun']) ||
          hasAny(p.occasion, ['casual']) ||
          hasAny(p.season, ['ljeto'])
      );

    case 'office':
      return all.filter(
        (p) => hasAny(p.occasion, ['posao']) || p.intensity === 'svježe' || p.intensity === 'srednje'
      );

    case 'date':
      return all.filter(
        (p) => hasAny(p.occasion, ['dejt']) || hasAny(p.notes, ['vanilija', 'ambra', 'mošus', 'koža'])
      );

    case 'night':
      return all.filter((p) => hasAny(p.occasion, ['izlazak']) || p.intensity === 'jako');

    case 'winter':
      return all.filter(
        (p) => hasAny(p.season, ['zima', 'jesen']) || hasAny(p.notes, ['vanilija', 'ambra', 'oud', 'koža', 'začinsko'])
      );

    case 'minimal':
      return all.filter((p) => p.intensity === 'svježe' || hasAny(p.notes, ['iris', 'cvjetno', 'drvo']));

    default:
      return all;
  }
}
