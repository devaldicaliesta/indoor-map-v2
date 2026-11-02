import { describe, expect, it } from 'vitest';
import { brandDisplayName, EMPTY_BRANDING, MAX_DISPLAY_NAME_LENGTH, parseBranding } from '../src';

describe('parseBranding', () => {
  it('membaca data branding; warna dijadikan huruf kecil dan nama dirapikan', () => {
    expect(
      parseBranding({
        displayName: '  RS   Sehat  Sentosa ',
        primaryColor: '#0B1F4D',
        routeColor: '#e4002b',
      }),
    ).toEqual({
      displayName: 'RS Sehat Sentosa',
      primaryColor: '#0b1f4d',
      routeColor: '#e4002b',
    });
  });

  it('entri rusak dibuang per kunci, bukan seluruh branding', () => {
    expect(
      parseBranding({ displayName: 42, primaryColor: 'kuning', routeColor: '#1463ff' }),
    ).toEqual({ displayName: null, primaryColor: null, routeColor: '#1463ff' });
    expect(parseBranding({ displayName: '   ' })).toEqual(EMPTY_BRANDING);
    expect(parseBranding(null)).toEqual(EMPTY_BRANDING);
    expect(parseBranding([])).toEqual(EMPTY_BRANDING);
  });

  it('nama yang terlalu panjang dipotong agar header tetap rapi', () => {
    const long = 'Ä'.repeat(MAX_DISPLAY_NAME_LENGTH + 10);
    expect(parseBranding({ displayName: long }).displayName).toBe(
      'Ä'.repeat(MAX_DISPLAY_NAME_LENGTH),
    );
  });
});

describe('brandingJson dan brandDisplayName', () => {
  it('nama tampilan jatuh ke nama venue bila kosong', () => {
    expect(brandDisplayName('RS Kenari', null)).toBe('RS Kenari');
    expect(brandDisplayName('RS Kenari', undefined)).toBe('RS Kenari');
    expect(brandDisplayName('RS Kenari', EMPTY_BRANDING)).toBe('RS Kenari');
    expect(brandDisplayName('RS Kenari', { ...EMPTY_BRANDING, displayName: 'Kenari' })).toBe(
      'Kenari',
    );
  });
});
