import { describe, expect, it } from 'vitest';
import { PICTOGRAM_KEYS } from './facility';

describe('ikon jenis fasilitas', () => {
  it('set bawaan memuat 14 piktogram yang diminta tanpa duplikat', () => {
    expect(new Set(PICTOGRAM_KEYS).size).toBe(14);
  });
});
