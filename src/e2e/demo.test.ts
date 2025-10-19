import { test, expect } from './fixtures';
import { dummyWindows } from '$lib/dummydata';

test('first tab is visible in popup', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/index.html`);
	const firstTabTitle = dummyWindows[0].tabs[0].title;
	await expect(page.getByRole('button', { name: firstTabTitle })).toBeVisible();
});
