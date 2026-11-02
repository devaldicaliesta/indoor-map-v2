import { expect, test } from '@playwright/test';

const DEMO_SLUGS = [
  'demo',
  'demo-mal',
  'demo-kampus',
  'demo-kantor',
  'demo-bandara',
  'demo-pabrik',
  'demo-konser',
];

test.describe('landing page', () => {
  test('menampilkan pesan utama, cara kerja, dan tujuh gedung demo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tersesat di dalam gedung');
    await expect(page.getByRole('heading', { name: 'Tiga langkah sampai tujuan' })).toBeVisible();
    const demos = page.getByRole('region', { name: 'Pilih gedung demo' }).getByRole('listitem');
    await expect(demos).toHaveCount(DEMO_SLUGS.length);
    for (const slug of DEMO_SLUGS) {
      await expect(page.locator(`a[href="/v/${slug}"]`).first()).toBeVisible();
    }
    for (const card of await demos.all()) {
      await expect(card.locator('img')).toHaveJSProperty('complete', true);
      expect(
        await card.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth),
      ).toBeGreaterThan(0);
    }
  });

  test('tombol utama membuka demo rumah sakit', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Coba demo rumah sakit' }).click();
    await expect(page).toHaveURL(/\/v\/demo$/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'RS Demo Harapan' })).toBeVisible();
  });

  test('bahasa Inggris berlaku langsung', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /English|Inggris/ }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Lost inside a building');
  });

  test('tidak menyebut Admin atau login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /admin|login|masuk/i })).toHaveCount(0);
  });
});
