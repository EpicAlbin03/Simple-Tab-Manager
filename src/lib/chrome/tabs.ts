import { isChromeExtension } from './utils';
import { windowsStore } from '$lib/stores.svelte';
import { emptyDummyWindow } from '$lib/dummydata';
import type { SortableEvent } from 'sortablejs';

//*-----------------------------------------------------------------------*//
//*------------------------------- Events --------------------------------*//
//*-----------------------------------------------------------------------*//
export function addTabEventListeners() {
	if (isChromeExtension()) {
		chrome.tabs.onCreated.addListener(async (tab) => await createTabCallback(tab));
		chrome.tabs.onRemoved.addListener(
			async (tabId, { windowId }) => await removeTabCallback(windowId, tabId)
		);
		chrome.tabs.onUpdated.addListener(async (tabId) => await updateTabCallback(tabId));
		// chrome.tabs.onMoved.addListener();
		// chrome.tabs.onAttached.addListener()
		// chrome.tabs.onDetached.addListener()
		// chrome.tabs.onReplaced.addListener()
	}
}

export function removeTabEventListeners() {
	if (isChromeExtension()) {
		chrome.tabs.onCreated.removeListener(async (tab) => await createTabCallback(tab));
		chrome.tabs.onRemoved.removeListener(
			async (tabId, { windowId }) => await removeTabCallback(windowId, tabId)
		);
		chrome.tabs.onUpdated.removeListener(async (tabId) => await updateTabCallback(tabId));
		// chrome.tabs.onMoved.removeListener();
		// chrome.tabs.onAttached.removeListener()
		// chrome.tabs.onDetached.removeListener()
		// chrome.tabs.onReplaced.removeListener()
	}
}

async function createTabCallback(tab: ChromeTab) {
	windowsStore.addTab(tab);
}

async function removeTabCallback(windowId: number, tabId: number) {
	windowsStore.removeTab(windowId, tabId);
}

// TODO: Look into updating pinned tab
async function updateTabCallback(tabId: number) {
	const tab = await getTab(tabId);
	if (tab) windowsStore.updateTab(tab);
}

//*-----------------------------------------------------------------------*//
//*----------------------------- Functions -------------------------------*//
//*-----------------------------------------------------------------------*//
export async function openTab(tabId: number, windowId: number) {
	await chrome.windows.update(windowId, { focused: true });
	await chrome.tabs.update(tabId, { active: true });
}

export async function createEmptyTab(windowId: number) {
	if (isChromeExtension()) {
		await chrome.tabs.create({ active: true, windowId });
	} else {
		emptyDummyWindow.tabs![0].windowId = windowId;
		windowsStore.addTab(emptyDummyWindow.tabs![0]);
	}
}

export async function getTab(tabId: number) {
	if (isChromeExtension()) {
		return await chrome.tabs.get(tabId);
	} else {
		const window = windowsStore.windows.find((window) =>
			window.tabs?.find((tab) => tab.id === tabId)
		);
		return window?.tabs?.find((tab) => tab.id === tabId);
	}
}

export async function queryTabs(queryInfo: chrome.tabs.QueryInfo = {}) {
	return await chrome.tabs.query(queryInfo);
}

export async function getPinnedTabs(windowId: number) {
	return await chrome.tabs.query({ windowId, pinned: true });
}

// TODO: Make it work for multiple tabs
export async function moveTabs(
	items: SortableEvent['items'],
	windowId: number,
	newIndices: SortableEvent['newIndicies'],
	oldIndices: SortableEvent['oldIndicies']
) {
	// * Determine if the tabs are being moved up or down
	const movingUp = newIndices[0].index < oldIndices[0].index;

	// * Sort items based on the direction of the move
	const sortedItems = movingUp
		? items
				.slice()
				.sort((a, b) => oldIndices[items.indexOf(b)].index - oldIndices[items.indexOf(a)].index)
		: items
				.slice()
				.sort((a, b) => oldIndices[items.indexOf(a)].index - oldIndices[items.indexOf(b)].index);

	const promises = sortedItems.map(async (item, i) => {
		const tabId = parseInt(item.id);
		const tab = await getTab(tabId);
		let newIndex = newIndices[i].index;
		const oldIndex = oldIndices[i].index;

		// const numTabs = (await queryTabs({ windowId })).length;
		const numPinnedTabs = (await getPinnedTabs(windowId)).length;
		// const numUnpinnedTabs = numTabs - numPinnedTabs;

		if (tab?.pinned) {
			// console.log(newIndex, numPinnedTabs);
			if (newIndex >= numPinnedTabs) {
				newIndex = numPinnedTabs;
			}
		}

		// * Single tab
		if (newIndices.length <= 1) {
			// console.log('newIndex', newIndex);
			await chrome.tabs.move(tabId, {
				index: newIndex,
				windowId
			});

			// * Repin tab if moved to a different window
			if (tab?.pinned && tab.windowId !== windowId) {
				await chrome.tabs.update(tabId, { pinned: true });
				await chrome.tabs.move(tabId, {
					index: newIndex,
					windowId
				});
			}
		} else {
			// * Multiple tabs
			let multipleOffset = 0;
			if (newIndex > oldIndex) {
				multipleOffset = items.length - i - 1;
			} else {
				multipleOffset = -multipleOffset;
			}

			if (newIndex < numPinnedTabs) {
				newIndex = numPinnedTabs + 1;
			}

			// console.log('newIndex', newIndex);
			await chrome.tabs.move(tabId, {
				index: newIndex + multipleOffset,
				windowId
			});

			if (tab?.pinned && tab.windowId !== windowId) {
				await chrome.tabs.update(tabId, { pinned: true });
				await chrome.tabs.move(tabId, {
					index: newIndex + multipleOffset,
					windowId
				});
			}
		}
	});

	return await Promise.all(promises);
}

export async function pinTabs(tabIds: number[]) {
	const promises = tabIds.map(async (tabId) => {
		return await chrome.tabs.update(tabId, { pinned: true });
	});
	return await Promise.all(promises);
}
