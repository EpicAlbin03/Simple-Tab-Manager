import Sortable from 'sortablejs';
import { getAllWindows } from './chrome/windows';

export const windowsStore = createWindowsStore();

// * Everything that uses the chrome event listeners won't work on localhost
function createWindowsStore() {
	let windows: ChromeWindow[] = $state([]);

	async function refreshWindows() {
		windows = await getAllWindows();
		return windows;
	}

	function removeFocus() {
		const focusedWindow = windows.find((window) => window.focused);
		if (focusedWindow) {
			focusedWindow.focused = false;
		}
	}

	function focusPrevFocusedWindow() {
		let mostRecentWindowId: number | undefined;
		let mostRecentLastAccessed = 0;

		for (const window of windows) {
			for (const tab of window.tabs!) {
				if (tab.lastAccessed) {
					if (tab.lastAccessed > mostRecentLastAccessed) {
						mostRecentLastAccessed = tab.lastAccessed;
						mostRecentWindowId = window.id!;
					}
				}
			}
		}

		const index = windows.findIndex((window) => window.id === mostRecentWindowId);
		windows[index].focused = true;
	}

	async function addWindow(window: ChromeWindow) {
		windows.push(window);
	}

	async function removeWindow(windowId: number) {
		const windowIndex = windows.findIndex((window) => window.id === windowId);
		if (windowIndex !== -1) {
			windows.splice(windowIndex, 1);
			focusPrevFocusedWindow();
		}
	}

	function updateWindow(newWindow: ChromeWindow) {
		removeFocus();
		const windowIndex = windows.findIndex((window) => window.id === newWindow.id);
		if (windowIndex !== -1) {
			windows[windowIndex] = newWindow;
		}
	}

	function addTab(tab: ChromeTab) {
		const window = windows.find((window) => window.id === tab.windowId);
		if (window) {
			window.tabs?.push(tab);
		}
	}

	function removeTab(windowId: number, tabId: number) {
		const window = windows.find((window) => window.id === windowId);
		if (window) {
			const sortableTab = document.getElementById(tabId.toString());
			if (sortableTab) {
				Sortable.utils.deselect(sortableTab);
				const tabIndex = window.tabs!.findIndex((tab) => tab.id === tabId);
				if (tabIndex !== -1) window.tabs![tabIndex].pressed = false;
			}

			const tabIndex = window.tabs!.findIndex((tab) => tab.id === tabId);
			if (tabIndex !== -1) window.tabs!.splice(tabIndex, 1);
		}
	}

	function updateTab(newTab: ChromeTab) {
		const window = windows.find((window) => window.id === newTab.windowId);
		if (window) {
			const tabIndex = window.tabs!.findIndex((tab) => tab.id === newTab.id);
			if (tabIndex !== -1) window.tabs![tabIndex] = newTab;
		}
	}

	function clearPressed() {
		windows.forEach((window) => {
			window.tabs!.forEach((tab) => {
				tab.pressed = false;
			});
		});
	}

	return {
		get windows() {
			return windows;
		},
		refreshWindows,
		addWindow,
		removeWindow,
		updateWindow,
		addTab,
		removeTab,
		updateTab,
		clearPressed
	};
}
