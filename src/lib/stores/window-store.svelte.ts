import { getAllWindows } from '$lib/chrome/windows';
import { Context, useDebounce } from 'runed';

export class WindowStore {
	windows = $state<ChromeWindow[]>([]);
	isLoading = $state(true);

	constructor() {
		this.loadWindows();
	}

	async loadWindows() {
		this.isLoading = true;
		const windows = await getAllWindows();
		if (windows) {
			this.windows = windows;
		}
		this.isLoading = false;
	}

	private debouncedRefresh = useDebounce(() => this.loadWindows(), 100);

	addListeners() {
		chrome.tabs.onCreated.addListener(() => this.debouncedRefresh());
		chrome.tabs.onRemoved.addListener(() => this.debouncedRefresh());
		chrome.tabs.onUpdated.addListener(() => this.debouncedRefresh());
		chrome.tabs.onMoved.addListener(() => this.debouncedRefresh());
	}

	removeListeners() {
		chrome.tabs.onCreated.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onRemoved.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onUpdated.removeListener(() => this.debouncedRefresh());
		chrome.tabs.onMoved.removeListener(() => this.debouncedRefresh());
	}
}

export const WindowStoreContext = new Context<WindowStore>('WindowStore');
