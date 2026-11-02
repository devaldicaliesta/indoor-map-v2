/** Urutan tampil: `sortOrder`, lalu nama. */
export function sortByOrder<T extends { name: string; sortOrder: number }>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'id'));
}
