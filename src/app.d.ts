// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type ChromeTab = chrome.tabs.Tab & {
		pressed?: boolean;
	};

	type ChromeWindow = Omit<chrome.windows.Window, 'tabs'> & {
		tabs?: Tab[];
	};
}

export {};
