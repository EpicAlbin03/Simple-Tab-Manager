import { getAllWindows } from '$lib/chrome/windows';
import { asyncReadable } from '@square/svelte-store';
import { writable } from 'svelte/store';

export const environmentStore = writable<string>('development');

export const windowsStore = asyncReadable(
	[],
	async () => {
		const windows = (await getAllWindows()) as chrome.windows.Window[];
		return windows;
	},
	{ reloadable: true }
);

export const selectedTabsStore = writable<HTMLElement[]>([]);
