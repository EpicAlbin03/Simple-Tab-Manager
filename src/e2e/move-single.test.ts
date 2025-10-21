import { test, expect } from './fixtures';

// ============================================================================
// SINGLE WINDOW - UNPINNED TABS
// ============================================================================

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
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab2.index];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([1, 0]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
});

test('move single tab up', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await tab2El.dragTo(tab1El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab2.index];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([1, 0]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
});

// ============================================================================
// SINGLE WINDOW - PINNED TABS
// ============================================================================

test('move pinned tab down among pinned tabs', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await serviceWorker.evaluate(
		async ([tab1Id, tab2Id]) => {
			await Promise.all([
				chrome.tabs.update(Number(tab1Id), { pinned: true }),
				chrome.tabs.update(Number(tab2Id), { pinned: true })
			]);
		},
		[tab1.id, tab2.id]
	);

	await tab1El.dragTo(tab2El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab1.pinned, tab2.index, tab2.pinned];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([1, true, 0, true]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
});

test('move pinned tab up among pinned tabs', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await serviceWorker.evaluate(
		async ([tab1Id, tab2Id]) => {
			await Promise.all([
				chrome.tabs.update(Number(tab1Id), { pinned: true }),
				chrome.tabs.update(Number(tab2Id), { pinned: true })
			]);
		},
		[tab1.id, tab2.id]
	);

	await tab2El.dragTo(tab1El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab1.pinned, tab2.index, tab2.pinned];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([1, true, 0, true]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
});

test('cannot move unpinned tab before pinned tabs', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await serviceWorker.evaluate(
		async (tab1Id) => {
			await chrome.tabs.update(Number(tab1Id), { pinned: true });
		},
		[tab1.id]
	);

	await tab2El.dragTo(tab1El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab1.pinned, tab2.index, tab2.pinned];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([0, true, 1, false]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab2.id.toString());
});

test('cannot move pinned tab after unpinned tabs', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab2 = windows[0].tabs[1];
	const tab1El = page.getByTestId(tab1.id);
	const tab2El = page.getByTestId(tab2.id);
	await expect(tab1El).toBeVisible();
	await expect(tab2El).toBeVisible();

	await serviceWorker.evaluate(
		async (tab1Id) => {
			await chrome.tabs.update(Number(tab1Id), { pinned: true });
		},
		[tab1.id]
	);

	await tab1El.dragTo(tab2El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id]) => {
					const [tab1, tab2] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id))
					]);
					return [tab1.index, tab1.pinned, tab2.index, tab2.pinned];
				},
				[tab1.id, tab2.id]
			);
		})
		.toEqual([0, true, 1, false]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab2.id.toString());
});

// ============================================================================
// SINGLE WINDOW - MULTIPLE TABS
// ============================================================================

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
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id)),
						chrome.tabs.get(Number(tab3Id))
					]);
					return [tab1.index, tab2.index, tab3.index];
				},
				[tab1.id, tab2.id, tab3.id]
			);
		})
		.toEqual([1, 2, 0]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(2)).toHaveId(tab2.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab3.id.toString());
});

test('move multiple tabs up', async ({ page, windows, context }) => {
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

	await tab2El.click();
	await tab3El.click();
	await expect(tab2El).toHaveClass(/sortable-selected/);
	await expect(tab3El).toHaveClass(/sortable-selected/);

	await tab2El.dragTo(tab1El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(
				async ([tab1Id, tab2Id, tab3Id]) => {
					const [tab1, tab2, tab3] = await Promise.all([
						chrome.tabs.get(Number(tab1Id)),
						chrome.tabs.get(Number(tab2Id)),
						chrome.tabs.get(Number(tab3Id))
					]);
					return [tab1.index, tab2.index, tab3.index];
				},
				[tab1.id, tab2.id, tab3.id]
			);
		})
		.toEqual([2, 0, 1]);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(2)).toHaveId(tab1.id.toString());
	await expect(window.locator('li').nth(0)).toHaveId(tab2.id.toString());
	await expect(window.locator('li').nth(1)).toHaveId(tab3.id.toString());
});

// ============================================================================
// EDGE CASES
// ============================================================================

test('move tab to same position does nothing', async ({ page, windows, context }) => {
	const [serviceWorker] = context.serviceWorkers();

	const tab1 = windows[0].tabs[0];
	const tab1El = page.getByTestId(tab1.id);
	await expect(tab1El).toBeVisible();
	const initialIndex = tab1.index;

	await tab1El.dragTo(tab1El);

	await expect
		.poll(async () => {
			return await serviceWorker.evaluate(async (tab1Id) => {
				const tab = await chrome.tabs.get(Number(tab1Id));
				return tab.index;
			}, tab1.id);
		})
		.toBe(initialIndex);

	const window = page.getByTestId(windows[0].id!.toString());
	await expect(window.locator('li').nth(initialIndex)).toHaveId(tab1.id.toString());
});
