import { windowsStore, environmentStore } from '$lib/stores';
import { windows } from '$lib/dummydata';
import { get } from 'svelte/store';

export function addWindowEventListeners() {
	chrome.windows.onCreated.addListener(() => {
		windowsStore.reload?.();
	});
	chrome.windows.onRemoved.addListener(() => {
		windowsStore.reload?.();
	});
	chrome.windows.onFocusChanged.addListener(() => {
		windowsStore.reload?.();
	});
}

export async function getAllWindows() {
	const env = get(environmentStore);
	if (env === 'prod') {
		return await chrome.windows.getAll({ populate: true });
	} else {
		return new Promise((resolve) => {
			resolve(windows);
		});
	}
}

export async function getWindow(windowId: number) {
	return await chrome.windows.get(windowId, { populate: true });
}

export async function createEmptyWindow() {
	await chrome.windows.create({ focused: true });
}

export async function removeWindow(windowId: number) {
	return await chrome.windows.remove(windowId);
}

export async function openWindow(windowId: number) {
	return await chrome.windows.update(windowId, { focused: true });
}

export async function toggleMinimizedWindow(windowId: number) {
	const window = await getWindow(windowId);
	if (window.state === 'minimized') {
		return await chrome.windows.update(windowId, { state: 'normal', focused: true });
	} else {
		return await chrome.windows.update(windowId, { state: 'minimized' });
	}
}
