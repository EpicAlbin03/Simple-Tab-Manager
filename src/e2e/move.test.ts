import { test, expect } from './fixtures';

test('move single tab down', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await tab1El.dragTo(tab2El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(tab1Id!),
						chrome.tabs.get(tab2Id!)
					]);
					return [tab1.index, tab2.index];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([1, 0]);

	const window = page.getByTestId(windows[0].id!.toString());
	expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
	expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
});

test('move multiple tabs down', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab3 = windows[0].tabs[2];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	const tab3El = page.getByTestId(tab3.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();
	await expect(tab3El).toBeVisible();

	await tab1El.click();
	await tab2El.click();
	await expect(tab1El).toHaveClass(/sortable-selected/);
	await expect(tab2El).toHaveClass(/sortable-selected/);

	await tab1El.dragTo(tab3El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id, tab3Id]) => {
					const [tab1, tab2, tab3] = await Promise.all([
						chrome.tabs.get(tab1Id!),
						chrome.tabs.get(tab2Id!),
						chrome.tabs.get(tab3Id!)
					]);
					return [tab1.index, tab2.index, tab3.index];
				},
				[tab1.id, tab2.id, tab3.id]
			);
		})
		.toEqual([1, 2, 0]);

	const window = page.getByTestId(windows[0].id!.toString());
	expect(window.locator('li').nth(0)).toHaveId(tab3.id.toString());
	expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	expect(window.locator('li').nth(2)).toHaveId(tab2.id.toString());
});
