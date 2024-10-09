import {
	createTab,
	muteSelectedTabs,
	removeSelectedTabs,
	togglePinSelectedTabs
} from './chrome/tabs';
import { createEmptyWindow } from './chrome/windows';

//*-----------------------------------------------------------------------*//
//*----------------------------- Bottom nav -------------------------------*//
//*-----------------------------------------------------------------------*//
export function onSearch(event: KeyboardEvent, searchInput: HTMLElement) {
	if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
		event.preventDefault();
		searchInput.focus();
	}
}

export function onFocusSearch(event: FocusEvent, kbd: HTMLElement) {
	kbd.classList.add('hidden');
}

export function onFocusoutSearch(event: FocusEvent, kbd: HTMLElement) {
	kbd.classList.remove('hidden');
}

export async function onNewWindow(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
		event.preventDefault();
		await createEmptyWindow();
	}
}

export async function onBookmarkManager(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
		event.preventDefault();
		await createTab('chrome://bookmarks/');
	}
}

export async function onMuteTabs(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'M') {
		event.preventDefault();
		await muteSelectedTabs();
	}
}

export async function onPinTabs(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'P') {
		console.log('hello');
		event.preventDefault();
		await togglePinSelectedTabs();
	}
}

export async function onCloseTabs(event: KeyboardEvent) {
	if (
		(event.metaKey || event.ctrlKey) &&
		event.shiftKey &&
		(event.key === 'Delete' || event.key === 'Backspace')
	) {
		event.preventDefault();
		await removeSelectedTabs();
	}
}

//*-----------------------------------------------------------------------*//
//*------------------------------ Top nav --------------------------------*//
//*-----------------------------------------------------------------------*//
export async function onExport(event: KeyboardEvent, exportWindows: () => void) {
	if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'S') {
		event.preventDefault();
		exportWindows();
	}
}
