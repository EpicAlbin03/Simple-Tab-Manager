import { dummyWindows } from '$lib/dummydata';
import { windowsStore } from '$lib/stores.svelte';
import { clearSelectedTabs } from './tabs';
import { isChromeExtension } from './utils';

//*-----------------------------------------------------------------------*//
//*------------------------------- Events --------------------------------*//
//*-----------------------------------------------------------------------*//
export function addWindowEventListeners() {
	if (isChromeExtension()) {
		chrome.windows.onCreated.addListener(async (window) => {
			if (window.id) {
				await createWindowCallback(window.id);
			}
		});

		chrome.windows.onRemoved.addListener(async (windowId) => await removeWindowCallback(windowId));

		chrome.windows.onFocusChanged.addListener(async (windowId) => {
			if (windowId !== chrome.windows.WINDOW_ID_NONE) {
				await updateWindowCallback(windowId);
			}
		});

		chrome.windows.onBoundsChanged.addListener(async (window) => {
			if (window.id) {
				await updateWindowCallback(window.id);
			}
		});
	}
}

export function removeWindowEventListeners() {
	if (isChromeExtension()) {
		chrome.windows.onCreated.removeListener(async (window) => {
			if (window.id) {
				await createWindowCallback(window.id);
			}
		});

		chrome.windows.onRemoved.removeListener(
			async (windowId) => await removeWindowCallback(windowId)
		);

		chrome.windows.onFocusChanged.removeListener(async (windowId) => {
			if (windowId !== chrome.windows.WINDOW_ID_NONE) {
				await updateWindowCallback(windowId);
			}
		});

		chrome.windows.onBoundsChanged.removeListener(async (window) => {
			if (window.id) {
				await updateWindowCallback(window.id);
			}
		});
	}
}

async function createWindowCallback(windowId: number) {
	const populatedWindow = await getWindow(windowId, { populate: true });
	windowsStore.addWindow(populatedWindow);
	clearSelectedTabs();
}

async function removeWindowCallback(windowId: number) {
	windowsStore.removeWindow(windowId);
	clearSelectedTabs();
}

// ? Possibly keep selection after focused changed
async function updateWindowCallback(windowId: number) {
	const window = await getWindow(windowId, { populate: true });
	windowsStore.updateWindow(window);
	clearSelectedTabs();
}

//*-----------------------------------------------------------------------*//
//*----------------------------- Functions -------------------------------*//
//*-----------------------------------------------------------------------*//
export async function getAllWindows() {
	if (isChromeExtension()) {
		const windows = await chrome.windows.getAll({ populate: true });
		const lastFocusedWindow = await chrome.windows.getLastFocused();
		const index = windows.findIndex((window) => window.id === lastFocusedWindow.id);
		windows[index].focused = true;
		return windows;
	} else {
		return windowsStore.windows.length > 0 ? windowsStore.windows : dummyWindows;
	}
}

export async function getWindow(windowId: number, queryOptions: chrome.windows.QueryOptions = {}) {
	return await chrome.windows.get(windowId, queryOptions);
}

export async function getLastFocusedWindow() {
	return await chrome.windows.getLastFocused();
}

export async function createEmptyWindow() {
	return await chrome.windows.create({ focused: true });
}

export async function removeWindow(windowId: number) {
	return await chrome.windows.remove(windowId);
}

export async function minimizeWindow(windowId: number, minimized: boolean) {
	if (minimized) {
		return await chrome.windows.update(windowId, { state: 'minimized' });
	} else {
		return await chrome.windows.update(windowId, { state: 'normal' });
	}
}
