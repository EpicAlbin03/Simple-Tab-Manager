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
