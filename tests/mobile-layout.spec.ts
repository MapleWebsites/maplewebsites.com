import { test, expect } from '@playwright/test';

test.describe('Mobile layout', () => {
  test('no horizontal overflow on homepage', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('navigation is accessible on mobile', async ({ page }) => {
    await page.goto('/');
    // On mobile: either visible nav links OR a hamburger menu button
    const navLinks = page.locator('nav a');
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu"], .hamburger, .menu-toggle, [class*="mobile-menu"]');
    const hasVisibleNav = await navLinks.first().isVisible().catch(() => false);
    const hasMenuButton = await menuButton.first().isVisible().catch(() => false);
    // At least one navigation mechanism must exist
    expect(hasVisibleNav || hasMenuButton, 'No navigation mechanism found').toBeTruthy();
  });

  test('text is readable without zooming', async ({ page }) => {
    await page.goto('/');
    const fontSize = await page.locator('body').evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(14); // minimum readable font size
  });

  test('tap targets are large enough', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('nav a, .cta, a.btn, button').all();
    for (const link of links.slice(0, 10)) { // check first 10
      const box = await link.boundingBox();
      if (box && box.height > 0) {
        // Minimum 24px for accessibility (WCAG recommends 44px for touch, 24px minimum)
        expect(box.height, `Tap target too small: ${await link.textContent()}`).toBeGreaterThanOrEqual(24);
      }
    }
  });
});
