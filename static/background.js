/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.storage.sync.set({
			darkMode: false,
			gridView: false,
			hideOnSearch: false,
			windowMenuMaxHeight: 0,
			showUrl: false,
			showEntireTitle: false,
			sortByUrl: false,
			tooltips: true,
			tooltipsDelay: 500
		});
	}
});
