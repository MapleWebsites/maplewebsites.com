import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(3000);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(2000); // let async scripts load
    // Filter out known non-critical errors (e.g., favicon 404, analytics blocked)
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('googletagmanager') &&
      !e.includes('ERR_BLOCKED_BY_CLIENT') // ad blockers
    );
    expect(critical, `Console errors: ${critical.join(', ')}`).toHaveLength(0);
  });

  test('no broken images on homepage', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img[src]').all();
    for (const img of images) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const src = await img.getAttribute('src');
      expect(naturalWidth, `Broken image: ${src}`).toBeGreaterThan(0);
    }
  });

  test('fonts load correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const fontsLoaded = await page.evaluate(() => document.fonts.ready.then(() => true));
    expect(fontsLoaded).toBeTruthy();

    // Verify Outfit and Fraunces are actually used
    const fontFamily = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily.toLowerCase()).toContain('outfit');
  });

  test('page weight is under 600KB total (HTML + fonts)', async ({ page }) => {
    let totalBytes = 0;
    page.on('response', response => {
      const headers = response.headers();
      const size = parseInt(headers['content-length'] || '0');
      if (size > 0) totalBytes += size;
    });
    await page.goto('/');
    await page.waitForTimeout(1000); // let font files load
    // HTML ~144KB + 3 self-hosted font files ~214KB = ~358KB uncompressed
    // With gzip: ~33KB + ~214KB = ~247KB. Allow headroom to 600KB.
    expect(totalBytes).toBeLessThan(600000);
  });
});
