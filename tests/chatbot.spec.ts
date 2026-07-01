import { test, expect } from '@playwright/test';

// The widget markup is stable and self-hosted (see index.html):
//   #chat-launch  — the round launch button (aria-controls="chat-panel")
//   #chat-panel   — the dialog, starts [hidden]
//   #chat-text    — the message input
//   #chat-form    — the input form
//   #chat-messages .msg.bot / .msg.user — rendered messages
// Assert against those IDs rather than fuzzy [class*="chat"] matches, which
// otherwise resolve to the always-present #chatbot container and pass vacuously.

test.describe('Chatbot widget', () => {
  test('launch button is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#chat-launch')).toBeVisible();
  });

  test('opens the chat panel on click', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('#chat-panel');
    await expect(panel).toBeHidden();

    await page.locator('#chat-launch').click();

    await expect(panel).toBeVisible();
    await expect(page.locator('#chat-launch')).toHaveAttribute('aria-expanded', 'true');
    // Opening greets the user with at least one bot message.
    await expect(page.locator('#chat-messages .msg.bot').first()).toBeVisible();
  });

  test('responds to a pricing question', async ({ page }) => {
    await page.goto('/');
    await page.locator('#chat-launch').click();
    await expect(page.locator('#chat-panel')).toBeVisible();

    await page.locator('#chat-text').fill('How much does a website cost?');
    // requestSubmit() fires the form's submit handler deterministically,
    // avoiding implicit-submission edge cases across browsers.
    await page.locator('#chat-form').evaluate((f) => (f as HTMLFormElement).requestSubmit());

    // The user's message is echoed into the transcript...
    await expect(page.locator('#chat-messages .msg.user')).toContainText('How much');
    // ...and the bot replies with pricing content (answer begins "Our pricing is transparent").
    await expect(page.locator('#chat-messages')).toContainText(/499|transparent|pricing/i);
  });
});
