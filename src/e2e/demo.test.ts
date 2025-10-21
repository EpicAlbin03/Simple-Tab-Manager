import { test, expect } from './fixtures';

test('first tab is visible in popup', async ({ page, extensionId, windows }) => {
	await page.goto(`chrome-extension://${extensionId}/index.html`);
	const tab = windows[0].tabs[0];
	await expect(page.getByTestId(tab.id)).toBeVisible();
});
