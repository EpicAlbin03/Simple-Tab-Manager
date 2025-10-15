import { isChromeExtension } from './utils';

export async function getAllWindows() {
	if (isChromeExtension()) {
		const windows = await chrome.windows.getAll({ populate: true });
		const lastFocusedWindow = await getLastFocusedWindow();
		const index = windows.findIndex((window) => window.id === lastFocusedWindow.id);
		windows[index].focused = true;
		return windows;
	}
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
