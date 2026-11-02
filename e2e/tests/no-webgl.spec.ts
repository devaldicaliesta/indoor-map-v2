import { expect, test } from '@playwright/test';
import { VisitorPage } from '../pages/visitor-page';

test('tanpa WebGL: pesan pengganti peta, pencarian dan rute tetap jalan', async ({ page }) => {
  const visitor = new VisitorPage(page);
  await page.goto('/v/demo?o=b1b2c3d4e5f6');
  await expect(page.getByTestId('map-unavailable')).toBeVisible();
  await expect(page.getByTestId('venue-map')).toHaveCount(0);
  await expect(page.getByText('Terjadi kesalahan')).toHaveCount(0);

  await visitor.search.fill('radiologi');
  await visitor.results.filter({ hasText: 'Radiologi' }).first().click();
  await visitor.profile.getByRole('button', { name: 'Rute ke sini' }).click();
  const route = page.getByRole('region', { name: 'Rute' });
  await expect(route.getByRole('definition').first()).toHaveText('Lobi Utama');
  await expect(route.getByRole('list', { name: 'Langkah rute' })).toBeVisible();
});
