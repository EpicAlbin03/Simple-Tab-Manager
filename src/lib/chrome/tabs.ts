import type { SortableEvent } from 'sortablejs';
import { extractURL } from './utils';

export async function openTab(tabId: number, windowId: number) {
	await chrome.windows.update(windowId, { focused: true });
	return await chrome.tabs.update(tabId, { active: true });
}

export async function createEmptyTab(windowId: number, index: number | undefined = undefined) {
	return await chrome.tabs.create({ active: true, windowId, index });
}

export async function createTab(url: string) {
	return await chrome.tabs.create({ active: true, url });
}

export async function duplicateTab(url: string, index: number, pinned: boolean) {
	return await chrome.tabs.create({ active: true, url, index, pinned });
}

export async function removeTab(tabId: number) {
	return await chrome.tabs.remove(tabId);
}

export async function removeTabs(tabIds: number[]) {
	const promises = tabIds.map((tabId) => removeTab(tabId));
	return await Promise.all(promises);
}

export async function getTab(tabId: number) {
	return await chrome.tabs.get(tabId);
}

export function getSelectedTabElements() {
	return Array.from(document.querySelectorAll('.sortable-selected')) as HTMLElement[];
}

export async function queryTabs(queryInfo: chrome.tabs.QueryInfo = {}) {
	return await chrome.tabs.query(queryInfo);
}

export async function pinTab(tabId: number, pinned: boolean) {
	return await chrome.tabs.update(tabId, { pinned });
}

export async function pinTabs(tabIds: number[], pinned: boolean) {
	const promises = tabIds.map((tabId) => pinTab(tabId, pinned));
	return await Promise.all(promises);
}

export async function togglePinTabs(tabs: ChromeTab[]) {
	const promises = tabs.map((tab) => pinTab(tab.id!, !tab.pinned));
	return await Promise.all(promises);
}

export async function getPinnedTabs(windowId: number) {
	return await chrome.tabs.query({ windowId, pinned: true });
}

export async function muteTab(tabId: number, muted: boolean) {
	return await chrome.tabs.update(tabId, { muted });
}

export async function muteTabs(tabIds: number[], muted: boolean) {
	const promises = tabIds.map((tabId) => muteTab(tabId, muted));
	return await Promise.all(promises);
}

export async function toggleMuteTabs(tabs: ChromeTab[]) {
	const promises = tabs.map((tab) => muteTab(tab.id!, !tab.mutedInfo?.muted));
	return await Promise.all(promises);
}

export async function reloadTab(tabId: number) {
	return await chrome.tabs.reload(tabId);
}

export async function moveTab(tabId: number, index: number, windowId: number) {
	return await chrome.tabs.move(tabId, { index, windowId });
}

export async function moveTabs(
	items: SortableEvent['items'],
	windowId: number,
	newIndicies: SortableEvent['newIndicies'],
	oldIndicies: SortableEvent['oldIndicies']
) {
	const movingDown = newIndicies[0].index > oldIndicies[0].index;

	const promises = items.map(async (item, i) => {
		const tabId = parseInt(item.id);
		const tab = await getTab(tabId);
		if (!tab) return;
		let newIndex = newIndicies[i].index;

		const numPinnedTabs = (await getPinnedTabs(windowId)).length;

		if (!tab.pinned && newIndex < numPinnedTabs) {
			newIndex = numPinnedTabs + i;
		}

		if (movingDown && tab.windowId === windowId) {
			newIndex += items.length - i - 1;
		}

		await moveTab(tabId, newIndex, windowId);

		if (tab?.pinned && tab.windowId !== windowId) {
			await pinTab(tabId, true);
			await moveTab(tabId, newIndex, windowId);
		}
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

	await Promise.all([Promise.resolve(pinnedTabs), pinTabs(pinnedTabIds, false)]);

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

	await Promise.all(sortedTabs.map((tab, index) => chrome.tabs.move(tab.id!, { index })));

	const tabsToPin = sortedTabs
		.filter((tab) => pinnedTabSet.has(tab.id!))
		.map((tab) => chrome.tabs.update(tab.id!, { pinned: true }));

	await Promise.all(tabsToPin);
}

export function getSelectedTabsEl(windowId?: number) {
	if (windowId) {
		const sortableWindow = document.getElementById(windowId.toString());
		if (sortableWindow) {
			return Array.from(sortableWindow.querySelectorAll('.sortable-selected')) as HTMLLIElement[];
		}
	} else {
		return Array.from(document.querySelectorAll('.sortable-selected')) as HTMLLIElement[];
	}

	return [];
}
