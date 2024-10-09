import { extractURL, isChromeExtension } from './utils';
import { windowsStore } from '$lib/stores.svelte';
import type { SortableEvent } from 'sortablejs';
import Sortable from 'sortablejs';

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
		chrome.tabs.onMoved.addListener(async (tabId) => await updateTabCallback(tabId));
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
		chrome.tabs.onMoved.removeListener(async (tabId) => await updateTabCallback(tabId));
		// chrome.tabs.onAttached.removeListener()
		// chrome.tabs.onDetached.removeListener()
		// chrome.tabs.onReplaced.removeListener()
	}
}

async function createTabCallback(tab: ChromeTab) {
	windowsStore.addTab(tab);
	clearSelectedTabs();
}

async function removeTabCallback(windowId: number, tabId: number) {
	windowsStore.removeTab(windowId, tabId);
	clearSelectedTabs();
}

async function updateTabCallback(tabId: number) {
	const tab = await getTab(tabId);
	if (tab) windowsStore.updateTab(tab);
	clearSelectedTabs();
}

//*-----------------------------------------------------------------------*//
//*----------------------------- Functions -------------------------------*//
//*-----------------------------------------------------------------------*//
export function getSelectedTabs(windowId: number | undefined = undefined) {
	if (windowId) {
		const sortableWindow = document.getElementById(windowId.toString());
		if (sortableWindow) {
			return Array.from(sortableWindow.querySelectorAll('.sortable-selected')) as HTMLElement[];
		}
	} else {
		return Array.from(document.querySelectorAll('.sortable-selected')) as HTMLElement[];
	}

	return [];
}

export function clearSelectedTabs(windowId: number | undefined = undefined) {
	const selectedTabs = windowId ? getSelectedTabs(windowId) : getSelectedTabs();
	selectedTabs.forEach((tab) => {
		Sortable.utils.deselect(tab);
	});
	windowsStore.clearPressed(windowId);
}

export async function openTab(tabId: number, windowId: number) {
	await chrome.windows.update(windowId, { focused: true });
	return await chrome.tabs.update(tabId, { active: true });
}

export async function createEmptyTab(windowId: number) {
	return await chrome.tabs.create({ active: true, windowId });
}

export async function createTab(url: string) {
	return await chrome.tabs.create({ active: true, url });
}

export async function getTab(tabId: number) {
	return await chrome.tabs.get(tabId);
}

export async function queryTabs(queryInfo: chrome.tabs.QueryInfo = {}) {
	return await chrome.tabs.query(queryInfo);
}

export async function getPinnedTabs(windowId: number) {
	return await chrome.tabs.query({ windowId, pinned: true });
}

export async function moveTabs(
	items: SortableEvent['items'],
	windowId: number,
	newIndices: SortableEvent['newIndicies'],
	oldIndices: SortableEvent['oldIndicies']
) {
	const movingDown = newIndices[0].index > oldIndices[0].index;

	const promises = items.map(async (item, i) => {
		const tabId = parseInt(item.id);
		const tab = await getTab(tabId);
		if (!tab) return;
		let newIndex = newIndices[i].index;

		const numPinnedTabs = (await getPinnedTabs(windowId)).length;

		if (!tab.pinned && newIndex < numPinnedTabs) {
			newIndex = numPinnedTabs + i;
		}

		if (movingDown && tab.windowId === windowId) {
			newIndex += items.length - i - 1;
		}

		await chrome.tabs.move(tabId, {
			index: newIndex,
			windowId
		});

		if (tab?.pinned && tab.windowId !== windowId) {
			await chrome.tabs.update(tabId, { pinned: true });
			await chrome.tabs.move(tabId, {
				index: newIndex,
				windowId
			});
		}
	});

	return await Promise.all(promises);
}

export async function togglePinSelectedTabs() {
	const selectedTabs = getSelectedTabs();
	const tabIds = selectedTabs.map((tab) => parseInt(tab.id));
	const promises = tabIds.map(async (tabId) => {
		const tab = await getTab(tabId);
		if (tab) return await chrome.tabs.update(tabId, { pinned: !tab.pinned });
	});
	return await Promise.all(promises);
}

export async function unPinTabs(tabIds: number[]) {
	const promises = tabIds.map(async (tabId) => {
		return await chrome.tabs.update(tabId, { pinned: false });
	});
	return await Promise.all(promises);
}

export async function muteSelectedTabs() {
	const selectedTabs = getSelectedTabs();
	const tabIds = selectedTabs.map((tab) => parseInt(tab.id));
	const promises = tabIds.map(async (tabId) => {
		const tab = await getTab(tabId);
		if (tab) return await chrome.tabs.update(tabId, { muted: !tab.mutedInfo?.muted });
	});
	return await Promise.all(promises);
}

export async function removeSelectedTabs() {
	const selectedTabs = getSelectedTabs();
	const tabIds = selectedTabs.map((tab) => parseInt(tab.id));
	const promises = tabIds.map(async (tabId) => {
		return await chrome.tabs.remove(tabId);
	});
	return await Promise.all(promises);
}

export async function quickSort(
	window: ChromeWindow,
	sortingOption: 'title' | 'url',
	descending = false
) {
	if (!window.id || !window.tabs?.length) return;

	const pinnedTabs = await getPinnedTabs(window.id);
	const pinnedTabIds = pinnedTabs.map((tab) => tab.id!);

	await Promise.all([Promise.resolve(pinnedTabs), unPinTabs(pinnedTabIds)]);

	const pinnedTabSet = new Set(pinnedTabIds);

	const sortedTabs = Array.from(new Map(window.tabs.map((tab) => [tab.id, tab])).values()).sort(
		(a, b) => {
			const getValue = (tab: ChromeTab) => {
				const value = sortingOption === 'title' ? tab.title : tab.url;
				return (value || '').toLowerCase();
			};

			const aValue = sortingOption === 'url' ? extractURL(getValue(a)) : getValue(a);
			const bValue = sortingOption === 'url' ? extractURL(getValue(b)) : getValue(b);

			return descending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
		}
	);

	await Promise.all(
		sortedTabs.map((tab, index) =>
			chrome.tabs.move(tab.id!, { index }).then(() => console.log(tab.title))
		)
	);

	const tabsToPin = sortedTabs
		.filter((tab) => pinnedTabSet.has(tab.id!))
		.map((tab) => chrome.tabs.update(tab.id!, { pinned: true }));

	await Promise.all(tabsToPin);
}
