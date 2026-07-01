import { test, expect } from '@playwright/test';

const MAIN_PAGES = [
  '/',
  '/about.html',
  '/services.html',
  '/pricing.html',
  '/portfolio.html',
  '/blog.html',
  '/faq.html',
  '/contact.html',
];

test.describe('Page loads', () => {
  for (const page of MAIN_PAGES) {
    test(`${page} returns 200`, async ({ request }) => {
      const response = await request.get(page);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe('Internal links are not broken', () => {
  test('all navigation links on homepage resolve', async ({ page }) => {
    await page.goto('/');
    const navLinks = await page.locator('nav a[href]').all();
    expect(navLinks.length).toBeGreaterThan(0);

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) continue;

      const response = await page.request.get(href);
      expect(response.status(), `Broken link: ${href}`).toBe(200);
    }
  });
});

test.describe('Critical page elements', () => {
  test('homepage has H1', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('homepage has CTA button', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a:has-text("call"), a:has-text("contact"), a:has-text("book"), button:has-text("call"), button:has-text("contact")').first();
    await expect(cta).toBeVisible();
  });

  test('favicon is present', async ({ request }) => {
    const response = await request.get('/favicon.svg');
    expect(response.status()).toBe(200);
  });
});
