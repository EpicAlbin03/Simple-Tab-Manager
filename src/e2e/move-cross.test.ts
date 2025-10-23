// ! dragTo does not work between different sortablejs lists

// import { test, expect } from './fixtures';

// // ============================================================================
// // CROSS WINDOW - UNPINNED TABS
// // ============================================================================

// test('move single tab down', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[0];
// 	const targetTab = windows[1].tabs[1];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						targetTabIndex: targetTab.index,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 1,
// 			targetTabIndex: 0
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(targetTab.id.toString());
// });

// test('move single tab up', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[1];
// 	const targetTab = windows[1].tabs[0];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						targetTabIndex: targetTab.index,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 0,
// 			targetTabIndex: 1
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(targetTab.id.toString());
// });

// // ============================================================================
// // CROSS WINDOW - PINNED TABS
// // ============================================================================

// test('move pinned tab down among pinned tabs', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[0];
// 	const targetTab = windows[1].tabs[1];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await serviceWorker.evaluate(
// 		async ([tab1Id, targetTabId]) => {
// 			await Promise.all([
// 				chrome.tabs.update(Number(tab1Id), { pinned: true }),
// 				chrome.tabs.update(Number(targetTabId), { pinned: true })
// 			]);
// 		},
// 		[tab1.id, targetTab.id]
// 	);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab1Pinned: tab1.pinned,
// 						targetTabIndex: targetTab.index,
// 						targetTabPinned: targetTab.pinned,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 1,
// 			tab1Pinned: true,
// 			targetTabIndex: 0,
// 			targetTabPinned: true
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(targetTab.id.toString());
// });

// test('move pinned tab up among pinned tabs', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[1];
// 	const targetTab = windows[1].tabs[0];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await serviceWorker.evaluate(
// 		async ([tab1Id, targetTabId]) => {
// 			await Promise.all([
// 				chrome.tabs.update(Number(tab1Id), { pinned: true }),
// 				chrome.tabs.update(Number(targetTabId), { pinned: true })
// 			]);
// 		},
// 		[tab1.id, targetTab.id]
// 	);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab1Pinned: tab1.pinned,
// 						targetTabIndex: targetTab.index,
// 						targetTabPinned: targetTab.pinned,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 0,
// 			tab1Pinned: true,
// 			targetTabIndex: 1,
// 			targetTabPinned: true
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(targetTab.id.toString());
// });

// test('cannot move unpinned tab before pinned tabs', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[1];
// 	const targetTab = windows[1].tabs[0];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await serviceWorker.evaluate(
// 		async (targetTabId) => {
// 			await chrome.tabs.update(Number(targetTabId), { pinned: true });
// 		},
// 		[targetTab.id]
// 	);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win0Id, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab1Pinned: tab1.pinned,
// 						targetTabWindowId: targetTab.windowId,
// 						targetTabIndex: targetTab.index,
// 						targetTabPinned: targetTab.pinned,
// 						expectedWin0Id: Number(win0Id),
// 						expectedWin1Id: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[0].id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[0].id,
// 			tab1Index: 1,
// 			tab1Pinned: false,
// 			targetTabWindowId: windows[1].id,
// 			targetTabIndex: 0,
// 			targetTabPinned: true
// 		});

// 	const window0 = page.getByTestId(windows[0].id!.toString());
// 	await expect(window0.locator('li').nth(1)).toHaveId(tab1.id.toString());

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(targetTab.id.toString());
// });

// test('cannot move pinned tab after unpinned tabs', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[0];
// 	const targetTab = windows[1].tabs[1];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await serviceWorker.evaluate(
// 		async (tab1Id) => {
// 			await chrome.tabs.update(Number(tab1Id), { pinned: true });
// 		},
// 		[tab1.id]
// 	);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, targetTabId, win0Id, win1Id]) => {
// 					const [tab1, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab1Pinned: tab1.pinned,
// 						targetTabWindowId: targetTab.windowId,
// 						targetTabIndex: targetTab.index,
// 						targetTabPinned: targetTab.pinned,
// 						expectedWin0Id: Number(win0Id),
// 						expectedWin1Id: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, targetTab.id, windows[0].id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[0].id,
// 			tab1Index: 0,
// 			tab1Pinned: true,
// 			targetTabWindowId: windows[1].id,
// 			targetTabIndex: 1,
// 			targetTabPinned: false
// 		});

// 	const window0 = page.getByTestId(windows[0].id!.toString());
// 	await expect(window0.locator('li').nth(0)).toHaveId(tab1.id.toString());

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(targetTab.id.toString());
// });

// // ============================================================================
// // CROSS WINDOW - MULTIPLE TABS
// // ============================================================================

// test('move multiple tabs down', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[0];
// 	const tab2 = windows[0].tabs[1];
// 	const targetTab = windows[1].tabs[2];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const tab2El = page.getByTestId(tab2.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(tab2El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await tab1El.click();
// 	await tab2El.click();
// 	await expect(tab1El).toHaveClass(/sortable-selected/);
// 	await expect(tab2El).toHaveClass(/sortable-selected/);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, tab2Id, targetTabId, win1Id]) => {
// 					const [tab1, tab2, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(tab2Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab2WindowId: tab2.windowId,
// 						tab2Index: tab2.index,
// 						targetTabIndex: targetTab.index,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, tab2.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 1,
// 			tab2WindowId: windows[1].id,
// 			tab2Index: 2,
// 			targetTabIndex: 0
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(2)).toHaveId(tab2.id.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(targetTab.id.toString());
// });

// test('move multiple tabs up', async ({ page, windows, context }) => {
// 	const [serviceWorker] = context.serviceWorkers();

// 	const tab1 = windows[0].tabs[1];
// 	const tab2 = windows[0].tabs[2];
// 	const targetTab = windows[1].tabs[0];
// 	const tab1El = page.getByTestId(tab1.id);
// 	const tab2El = page.getByTestId(tab2.id);
// 	const targetTabEl = page.getByTestId(targetTab.id);
// 	await expect(tab1El).toBeVisible();
// 	await expect(tab2El).toBeVisible();
// 	await expect(targetTabEl).toBeVisible();

// 	await tab1El.click();
// 	await tab2El.click();
// 	await expect(tab1El).toHaveClass(/sortable-selected/);
// 	await expect(tab2El).toHaveClass(/sortable-selected/);

// 	await tab1El.dragTo(targetTabEl);

// 	await expect
// 		.poll(async () => {
// 			return await serviceWorker.evaluate(
// 				async ([tab1Id, tab2Id, targetTabId, win1Id]) => {
// 					const [tab1, tab2, targetTab] = await Promise.all([
// 						chrome.tabs.get(Number(tab1Id)),
// 						chrome.tabs.get(Number(tab2Id)),
// 						chrome.tabs.get(Number(targetTabId))
// 					]);
// 					return {
// 						tab1WindowId: tab1.windowId,
// 						tab1Index: tab1.index,
// 						tab2WindowId: tab2.windowId,
// 						tab2Index: tab2.index,
// 						targetTabIndex: targetTab.index,
// 						expectedWindowId: Number(win1Id)
// 					};
// 				},
// 				[tab1.id, tab2.id, targetTab.id, windows[1].id]
// 			);
// 		})
// 		.toMatchObject({
// 			tab1WindowId: windows[1].id,
// 			tab1Index: 0,
// 			tab2WindowId: windows[1].id,
// 			tab2Index: 1,
// 			targetTabIndex: 2
// 		});

// 	const window1 = page.getByTestId(windows[1].id!.toString());
// 	await expect(window1.locator('li').nth(0)).toHaveId(tab1.id.toString());
// 	await expect(window1.locator('li').nth(1)).toHaveId(tab2.id.toString());
// 	await expect(window1.locator('li').nth(2)).toHaveId(targetTab.id.toString());
// });
