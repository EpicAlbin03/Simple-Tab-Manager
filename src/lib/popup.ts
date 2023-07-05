import { deselectTab, selectTab } from '$lib/chrome/tabs';

export function addGridRowSpan() {
	const windowMenus = Array.from(document.querySelectorAll('.menu')) as HTMLElement[];
	for (let i = 0; i < windowMenus.length; i++) {
		const menu = windowMenus[i];
		for (let j = 1; j < menu.children.length; j++) {
			if (menu.clientHeight > 68 * j) {
				menu.style.gridRow = `span ${j} / span ${j}`;
			}
		}
	}
}

export function handleRightClick(e: Event) {
	e.preventDefault();
	const tab = e.currentTarget as HTMLElement;
	if (!tab.classList.contains('sortable-selected')) {
		selectTab(tab);
	} else {
		deselectTab(tab);
	}
}