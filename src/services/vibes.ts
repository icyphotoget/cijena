import perfumes from '../data/perfumes.json';

export type Perfume = (typeof perfumes)[number];

export type VibeId =
  | 'fresh'
  | 'office'
  | 'date'
  | 'night'
  | 'winter'
  | 'minimal';

export type Vibe = {
  id: VibeId;
  title: string;
  subtitle: string;
};

export const VIBES: Vibe[] = [
  { id: 'fresh', title: 'Fresh & Clean', subtitle: 'svježe, lagano, daily' },
  { id: 'office', title: 'Office-safe', subtitle: 'sigurno za posao i ured' },
  { id: 'date', title: 'Date night', subtitle: 'privlačno, cozy, close-range' },
  { id: 'night', title: 'Night out', subtitle: 'glasnije, projekcija, party' },
  { id: 'winter', title: 'Winter warm', subtitle: 'slatko/ambar/začini za hladno' },
  { id: 'minimal', title: 'Minimal & Elegant', subtitle: 'čisto, elegantno, nenapadno' },
];

function hasAny(arr: unknown, wanted: string[]) {
  if (!Array.isArray(arr)) return false;
  return wanted.some((w) => (arr as string[]).includes(w));
}

function uniqById(items: Perfume[]) {
  const seen = new Set<string>();
  return items.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function getPerfumesForVibe(vibeId: VibeId): Perfume[] {
  const all = perfumes as Perfume[];

  let items: Perfume[] = [];

  switch (vibeId) {
    case 'fresh':
      items = all.filter(
        (p) =>
          hasAny(p.notes, ['citrus', 'morsko']) ||
          hasAny(p.occasion, ['casual']) ||
          hasAny(p.season, ['ljeto'])
      );
      break;

    case 'office':
      items = all.filter(
        (p) =>
          hasAny(p.occasion, ['posao']) ||
          p.intensity === 'svježe' ||
          p.intensity === 'srednje'
      );
      break;

    case 'date':
      items = all.filter(
        (p) =>
          hasAny(p.occasion, ['dejt']) ||
          hasAny(p.notes, ['vanilija', 'ambra', 'mošus', 'koža'])
      );
      break;

    case 'night':
      items = all.filter(
        (p) => hasAny(p.occasion, ['izlazak']) || p.intensity === 'jako'
      );
      break;

    case 'winter':
      items = all.filter(
        (p) =>
          hasAny(p.season, ['zima', 'jesen']) ||
          hasAny(p.notes, ['vanilija', 'ambra', 'oud', 'koža', 'začinsko'])
      );
      break;

    case 'minimal':
      items = all.filter(
        (p) =>
          p.intensity === 'svježe' || hasAny(p.notes, ['iris', 'cvjetno', 'drvo'])
      );
      break;
  }

  return uniqById(items);
}
