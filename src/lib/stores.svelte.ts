import { getAllWindows } from './chrome/windows';
import { getSessionStorageItem, setOptions, type Options } from './chrome/storage';

export const windowsStore = createWindowsStore();

function createWindowsStore() {
	let windows: ChromeWindow[] = $state([]);

	async function refreshWindows() {
		windows = await getAllWindows();
		windows.forEach(async (window, i) => {
			type StoredWindow = {
				name: string;
				color: string;
			};
			const storedWindow = (await getSessionStorageItem(`window-${window.id}`)) as StoredWindow;
			if (storedWindow && storedWindow.name && storedWindow.color) {
				const { name, color } = storedWindow;
				window.name = name;
				window.color = color;
			} else {
				if (!window.name) window.name = `Window ${i + 1}`;
				if (!window.color) window.color = undefined;
			}
		});
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
		window = {
			name: `Window ${windows.length + 1}`,
			...window
		};
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
			if (newWindow.name === undefined) newWindow.name = windows[windowIndex].name;
			if (newWindow.color === undefined) newWindow.color = windows[windowIndex].color;
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
			const tabIndex = window.tabs!.findIndex((tab) => tab.id === tabId);
			if (tabIndex !== -1) window.tabs!.splice(tabIndex, 1);
		}
	}

	function updateTab(newTab: ChromeTab) {
		const window = windows.find((window) => window.id === newTab.windowId);
		if (window) {
			const tabIndex = window.tabs!.findIndex((tab) => tab.id === newTab.id);
			if (tabIndex !== -1) {
				if (newTab.pressed === undefined) window.tabs![tabIndex].pressed = newTab.pressed;
				window.tabs![tabIndex] = newTab;

				if (tabIndex !== newTab.index) {
					const [updatedTab] = window.tabs!.splice(tabIndex, 1);
					window.tabs!.splice(newTab.index, 0, updatedTab);
				}
			}
		}
	}

	function clearPressed(windowId: number | undefined = undefined) {
		if (windowId) {
			const window = windows.find((window) => window.id === windowId);
			if (window) {
				window.tabs!.forEach((tab) => {
					tab.pressed = false;
				});
			}
		} else {
			windows.forEach((window) => {
				window.tabs!.forEach((tab) => {
					tab.pressed = false;
				});
			});
		}
	}

	function pressTab(tabId: number, windowId: number) {
		const window = windows.find((window) => window.id === windowId);
		if (window) {
			const tab = window.tabs!.find((tab) => tab.id === tabId);
			if (tab) tab.pressed = true;
		}
	}

	function changeName(windowId: number, name: string) {
		const window = windows.find((window) => window.id === windowId);
		if (window) {
			window.name = name;
		}
	}

	return {
		get windows() {
			return windows;
		},
		set windows(value: ChromeWindow[]) {
			windows = value;
		},
		refreshWindows,
		addWindow,
		removeWindow,
		updateWindow,
		addTab,
		removeTab,
		updateTab,
		clearPressed,
		pressTab,
		changeName
	};
}

export type OptionsStore = ReturnType<typeof createOptionsStore>;

export function createOptionsStore(defaultOptions: Options) {
	let options: Options = $state(defaultOptions);

	async function updateOptions(newOptions: Partial<Options>) {
		options = { ...options, ...newOptions };
		await setOptions(options);
	}

	return {
		get options() {
			return options;
		},
		updateOptions
	};
}

export type LastClickedTabIndexStore = ReturnType<typeof createLastClickedTabIndexStore>;

export function createLastClickedTabIndexStore() {
	let lastClickedTabIndex: number | undefined = $state();

	return {
		get lastClickedTabIndex() {
			return lastClickedTabIndex;
		},
		set lastClickedTabIndex(value: number | undefined) {
			lastClickedTabIndex = value;
		}
	};
}
