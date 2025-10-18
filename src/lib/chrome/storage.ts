import { mode } from 'mode-watcher';
import { isChromeExtension } from './utils';

export type Options = {
	theme: 'light' | 'dark';
	tabView: 'grid' | 'list';
	searchView: 'hide' | 'show';
	showTabUrl: boolean;
	sortByUrl: boolean;
	sortDescending: boolean;
	disableTooltips: boolean;
	truncateTabTitle: boolean;
};

export const defaultOptions: Options = {
	theme: mode.current ?? 'light',
	tabView: 'list',
	searchView: 'show',
	showTabUrl: false,
	sortByUrl: false,
	sortDescending: false,
	disableTooltips: false,
	truncateTabTitle: true
};

export async function getOptions() {
	if (!isChromeExtension()) {
		return defaultOptions;
	}

	const keys = Object.keys(defaultOptions) as (keyof Options)[];
	const storage: Partial<Options> = await chrome.storage.sync.get(keys);

	return {
		...defaultOptions,
		...storage
	};
}

export async function setOptions(items: Partial<Options>) {
	await chrome.storage.sync.set(items);
}

export async function getSessionStorageItem(key: string) {
	const { [key]: value } = await chrome.storage.session.get(key);
	if (value !== undefined) {
		return JSON.parse(value);
	} else {
		return {};
	}
}

export async function setSessionStorageItem(key: string, value: string) {
	await chrome.storage.session.set({ [key]: value });
}
