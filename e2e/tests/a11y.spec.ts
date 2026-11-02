import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const path of ['/', '/v/demo', '/v/demo-mal']) {
  test(`tanpa pelanggaran WCAG A/AA di ${path}`, async ({ page }) => {
    await page.goto(path);
    if (path !== '/') {
      await expect(page.getByTestId('venue-map')).toHaveAttribute('data-ready', 'true', {
        timeout: 30_000,
      });
    }
    const result = await new AxeBuilder({ page }).withTags(WCAG).exclude('canvas').analyze();
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
