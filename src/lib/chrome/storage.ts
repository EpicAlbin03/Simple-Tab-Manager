import { isChromeExtension } from './utils';

export type Options = {
	theme: 'light' | 'dark';
	tabView: 'grid' | 'list';
	searchView: 'hide' | 'show';
} & Settings;

export type Settings = typeof defaultSettings;

export const defaultSettings = {
	windowMaxHeight: 0,
	showTabUrl: false,
	sortByUrl: false,
	sortDescending: false,
	disableTooltips: false,
	truncateTabTitle: true
};

export async function getOptions(systemTheme: Options['theme']) {
	const defaultOptions: Options = {
		theme: systemTheme,
		tabView: 'list',
		searchView: 'show',
		...defaultSettings
	};

	const keys = Object.keys(defaultOptions);
	const storage = isChromeExtension()
		? await chrome.storage.sync.get(keys)
		: getLocalStorageOptions(keys);

	const options: Options = {
		theme: storage?.theme ?? defaultOptions.theme,
		tabView: storage?.tabView ?? defaultOptions.tabView,
		searchView: storage?.searchView ?? defaultOptions.searchView,
		windowMaxHeight: storage?.windowMaxHeight ?? defaultOptions.windowMaxHeight,
		showTabUrl: storage?.showTabUrl ?? defaultOptions.showTabUrl,
		sortByUrl: storage?.sortByUrl ?? defaultOptions.sortByUrl,
		sortDescending: storage?.sortDescending ?? defaultOptions.sortDescending,
		disableTooltips: storage?.disableTooltips ?? defaultOptions.disableTooltips,
		truncateTabTitle: storage?.truncateTabTitle ?? defaultOptions.truncateTabTitle
	};

	return options;
}

function getLocalStorageOptions(keys: string[]) {
	if (typeof window !== 'undefined') {
		return keys.reduce((result, key) => {
			const value = localStorage.getItem(key);
			if (value) {
				result[key as keyof Options] = JSON.parse(value);
			}
			return result;
		}, {} as Partial<Options>);
	}
}

export async function setOptions(items: Partial<Options>) {
	if (isChromeExtension()) {
		await chrome.storage.sync.set(items);
	} else {
		Object.keys(items).forEach((key) => {
			localStorage.setItem(key, JSON.stringify(items[key as keyof Options]));
		});
	}
}

export async function getSessionStorageItem(key: string) {
	if (isChromeExtension()) {
		const { [key]: value } = await chrome.storage.session.get(key);
		if (value !== undefined) {
			return JSON.parse(value);
		} else {
			return {};
		}
	} else if (typeof window !== 'undefined') {
		const value = sessionStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}
	}
}

export async function setSessionStorageItem(key: string, value: string) {
	if (isChromeExtension()) {
		await chrome.storage.session.set({ [key]: value });
	} else if (typeof window !== 'undefined') {
		sessionStorage.setItem(key, value);
	}
}
