import { expect, test } from '@playwright/test';
import { VisitorPage } from '../pages/visitor-page';

const HOSPITAL_LOBBY_QR = 'b1b2c3d4e5f6';

test.describe('demo pengunjung', () => {
  test('cari Radiologi lalu ikuti rute dari QR lobi', async ({ page }) => {
    const visitor = new VisitorPage(page);
    await page.goto(`/v/demo?o=${HOSPITAL_LOBBY_QR}`);
    await expect(visitor.map).toHaveAttribute('data-ready', 'true', { timeout: 30_000 });
    await expect(page.getByText(/Anda di sini/).first()).toBeVisible();

    await visitor.search.fill('radilogi');
    await visitor.results.filter({ hasText: 'Radiologi' }).first().click();
    await expect(visitor.profile).toContainText('Radiologi');
    await visitor.profile.getByRole('button', { name: 'Rute ke sini' }).click();

    const route = page.getByRole('region', { name: 'Rute' });
    const steps = route.getByRole('list', { name: 'Langkah rute' }).getByRole('listitem');
    await expect(route.getByRole('definition').first()).toHaveText('Lobi Utama');
    await expect(route.getByText(/^\d[\d.,]* m$/)).toBeVisible();
    expect(await steps.count()).toBeGreaterThan(1);
    await expect(steps.last()).toContainText('Radiologi');

    await route.getByRole('checkbox', { name: /Rute aksesibel/ }).check();
    await expect(steps.filter({ hasText: /eskalator|tangga/i })).toHaveCount(0);
  });

  test('tautan bagikan dari alamat slug membuka gedung yang sama', async ({ page }) => {
    await page.addInitScript(() => {
      const holder = window as Window & { sharedUrl?: string };
      navigator.share = async (data) => {
        holder.sharedUrl = data?.url ?? '';
      };
    });
    const visitor = new VisitorPage(page);
    await visitor.goto('demo-bandara');
    await expect(page.getByRole('heading', { name: 'Bandara Demo Nusantara' })).toBeVisible();
    await visitor.search.fill('check-in');
    await visitor.results.first().click();
    await visitor.profile.getByRole('button', { name: 'Bagikan' }).click();
    const shared = await page.evaluate(
      () => (window as Window & { sharedUrl?: string }).sharedUrl ?? '',
    );
    expect(shared).toMatch(/\/v\/[0-9a-f-]{36}/);
    await visitor.goto(new URL(shared).pathname.replace('/v/', ''));
    await expect(page.getByRole('heading', { name: 'Bandara Demo Nusantara' })).toBeVisible();
  });

  test('alamat yang bukan gedung demo diarahkan kembali ke beranda', async ({ page }) => {
    await page.goto('/v/tidak-ada');
    await expect(page.getByText('Demo tidak ditemukan')).toBeVisible();
    await page.getByRole('link', { name: 'Ke beranda' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
