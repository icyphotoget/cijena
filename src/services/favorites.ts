import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites:v1';

export type FavoriteItem = {
  id: string;
  brand: string;
  name: string;
};

async function readAll(): Promise<FavoriteItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: FavoriteItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function listFavorites(): Promise<FavoriteItem[]> {
  return readAll();
}

export async function isFavorite(id: string): Promise<boolean> {
  const items = await readAll();
  return items.some(x => x.id === id);
}

export async function addFavorite(item: FavoriteItem): Promise<void> {
  const items = await readAll();
  if (items.some(x => x.id === item.id)) return;
  await writeAll([item, ...items]);
}

export async function removeFavorite(id: string): Promise<void> {
  const items = await readAll();
  await writeAll(items.filter(x => x.id !== id));
}

export async function toggleFavorite(item: FavoriteItem): Promise<boolean> {
  const items = await readAll();
  const exists = items.some(x => x.id === item.id);
  if (exists) {
    await writeAll(items.filter(x => x.id !== item.id));
    return false;
  }
  await writeAll([item, ...items]);
  return true;
}
export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
