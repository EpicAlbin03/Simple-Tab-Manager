import { getSelectedTabsEl } from '$lib/chrome/tabs';
import { loadWindows } from '$lib/chrome/windows';
import { Context, useDebounce } from 'runed';
import Sortable from 'sortablejs';

export class WindowStore {
	windows = $state<ChromeWindow[]>([]);
	isLoading = $state(true);

	constructor() {
		this.loadWindows();
	}

	async loadWindows() {
		this.isLoading = true;
		const windows = await loadWindows();
		if (windows) {
			this.windows = windows;
		}
		this.isLoading = false;
	}

	private debouncedLoadWindows = useDebounce(() => this.loadWindows(), 100);

	debouncedRefresh(callback?: () => void) {
		this.debouncedLoadWindows();
		if (callback) {
			callback();
		}
	}

	getPressedTabs() {
		return this.windows
			.flatMap((window) => window.tabs)
			.filter((tab: ChromeTab) => tab.pressed) as ChromeTab[];
	}

	pressTab(tabId: number, windowId: number) {
		const window = this.windows.find((window) => window.id === windowId);
		if (window) {
			const tab = window.tabs!.find((tab) => tab.id === tabId) as ChromeTab | undefined;
			if (tab) {
				tab.pressed = true;
			}
		}
	}

	clearPressedTabs(windowId?: number) {
		if (windowId) {
			const window = this.windows.find((window) => window.id === windowId);
			if (window && window.tabs) {
				window.tabs.forEach((tab) => {
					tab.pressed = false;
				});
			}
		} else {
			this.windows.forEach((window) => {
				window.tabs.forEach((tab) => {
					tab.pressed = false;
				});
			});
		}

		const selectedTabs = getSelectedTabsEl(windowId);
		selectedTabs.forEach((tab) => {
			Sortable.utils.deselect(tab);
		});
	}

	addListeners() {
		// chrome.windows.onBoundsChanged.addListener(() => this.debouncedRefresh());
		chrome.windows.onCreated.addListener(() => this.debouncedRefresh());
		// chrome.windows.onFocusChanged.addListener(() => this.debouncedRefresh());
		chrome.windows.onRemoved.addListener(() => this.debouncedRefresh());
		// chrome.tabs.onActivated.addListener(() => this.debouncedRefresh());
		chrome.tabs.onAttached.addListener(() => this.debouncedRefresh());
		chrome.tabs.onCreated.addListener(() => this.debouncedRefresh());
		chrome.tabs.onDetached.addListener(() => this.debouncedRefresh());
		// chrome.tabs.onHighlighted.addListener(() => this.debouncedRefresh());
		chrome.tabs.onMoved.addListener(() => this.debouncedRefresh());
		chrome.tabs.onRemoved.addListener(() => this.debouncedRefresh());
		chrome.tabs.onReplaced.addListener(() => this.debouncedRefresh());
		chrome.tabs.onUpdated.addListener(() => this.debouncedRefresh());
		// chrome.tabs.onZoomChange.addListener(() => this.debouncedRefresh());
	}

	removeListeners() {
		// chrome.windows.onBoundsChanged.removeListener(() => this.debouncedRefresh());
		chrome.windows.onCreated.removeListener(() => this.debouncedRefresh());
		// chrome.windows.onFocusChanged.removeListener(() => this.debouncedRefresh());
		chrome.windows.onRemoved.removeListener(() => this.debouncedRefresh());
		// chrome.tabs.onActivated.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onAttached.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onCreated.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onDetached.removeListener(() => this.debouncedRefresh());
		// chrome.tabs.onHighlighted.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onMoved.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onRemoved.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onReplaced.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onUpdated.removeListener(() => this.debouncedRefresh());
		// chrome.tabs.onZoomChange.removeListener(() => this.debouncedRefresh());
	}
}

export const WindowStoreContext = new Context<WindowStore>('WindowStore');
