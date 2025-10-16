import { getSessionStorageItem } from './storage';
import { isChromeExtension } from './utils';

type StoredWindow = {
	name: string;
	color: string;
};

export async function getAllWindows() {
	if (isChromeExtension()) {
		const windows = (await chrome.windows.getAll({ populate: true })) as ChromeWindow[];
		const lastFocusedWindow = await getLastFocusedWindow();
		for (const [i, window] of windows.entries()) {
			if (window.id === lastFocusedWindow.id) {
				window.focused = true;
			}
			const storedWindow = (await getSessionStorageItem(`window-${window.id}`)) as StoredWindow;
			window.name = storedWindow?.name ?? `Window ${i + 1}`;
			window.color = storedWindow?.color ?? 'default';
			for (const tab of window.tabs) {
				tab.pressed = false;
			}
		}
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
