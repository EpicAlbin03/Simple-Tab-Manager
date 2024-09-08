import { isChromeExtension } from './utils';

export type Options = {
	theme: 'light' | 'dark';
	tabView: 'grid' | 'list';
	searchView: 'hide' | 'show';
};

export async function getOptions(systemTheme: Options['theme']) {
	const defaultOptions: Options = {
		theme: systemTheme,
		tabView: 'list',
		searchView: 'show'
	};

	const keys = Object.keys(defaultOptions);
	const storage = isChromeExtension()
		? await chrome.storage.sync.get(keys)
		: getLocalStorageOptions(keys);

	const options: Options = {
		theme: storage?.theme ?? defaultOptions.theme,
		tabView: storage?.tabView ?? defaultOptions.tabView,
		searchView: storage?.searchView ?? defaultOptions.searchView
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
