<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import { deselectTab, getPinnedTabs, getTab, moveTab, openTab, pinTab } from '$lib/chrome/tabs';
	import { handleRightClick } from '$lib/popup';
	import { getWindow } from '$lib/chrome/windows';
	import { selectedTabsStore } from '$lib/stores';
	import WindowMenuNav from './WindowMenuNav.svelte';

	export let window: chrome.windows.Window;
	export let i: number;

	let ctrlDown = false;
	let windowMenu: HTMLElement;
	let minimized = false;
	let windowColor = '';
	let gridView = false;
	let showUrl = false;
	let showEntireTitle = false;
	let windowMenuMaxHeight = 0;

	beforeUpdate(async () => {
		minimized = window.state === 'minimized';
		const gridViewData = await chrome.storage.sync.get('gridView');
		const showUrlData = await chrome.storage.sync.get('showUrl');
		const showEntireTitleData = await chrome.storage.sync.get('showEntireTitle');
		const windowMenuMaxHeightData = await chrome.storage.sync.get('windowMenuMaxHeight');
		gridView = gridViewData.gridView ?? gridView;
		showUrl = showUrlData.showUrl ?? showUrl;
		showEntireTitle = showEntireTitleData.showEntireTitle ?? showEntireTitle;
		windowMenuMaxHeight = windowMenuMaxHeightData.windowMenuMaxHeight ?? windowMenuMaxHeight;
	});

	onMount(async () => {
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey || e.metaKey) ctrlDown = true;
		});
		document.addEventListener('keyup', () => {
			if (ctrlDown) ctrlDown = false;
		});

		const sortable = new Sortable(windowMenu, {
			group: 'shared',
			animation: 150,
			swapThreshold: 0.65,
			multiDrag: true,
			fallbackTolerance: 3,
			avoidImplicitDeselect: true,

			onSelect: async function (e) {
				// Doesn't run on Sortable.utils.select()
				if (!ctrlDown) {
					deselectTab(e.item);
					await openTab(+e.item.id);
				} else {
					selectedTabsStore.update((tabs) => [...tabs, e.item]);
				}
			},
			onDeselect: function (e) {
				// Doesn't run on Sortable.utils.deselect()
				selectedTabsStore.update((tabs) => tabs.filter((tab) => tab.id !== e.item.id));
			},
			onEnd: async function (e) {
				if (e.newIndex !== undefined && e.oldIndex !== undefined) {
					if (e.newIndicies.length <= 0) {
						e.newIndicies.push({ multiDragElement: e.item, index: e.newIndex });
						e.items.push(e.item);
					}
					const newWindow = await getWindow(+e.to.id);
					const pinnedTabs = await getPinnedTabs(+e.to.id);

					let newIndex = [];
					for (const [i, item] of e.newIndicies.entries()) {
						const el = item.multiDragElement as HTMLElement;
						newIndex.push(e.newIndicies[i].index);
						if (e.oldIndex < e.newIndex && e.to.id === e.from.id)
							newIndex[i] += e.newIndicies.length - i - 1;
						const tab = await getTab(+el.id);
						let insertBeforePinned = false;
						if (newWindow.tabs) {
							for (const tab of newWindow.tabs) {
								if (e.newIndex <= tab.index && tab.pinned) {
									insertBeforePinned = true;
									e.to.insertBefore(el, e.to.children[pinnedTabs.length + e.newIndicies.length]);
									break;
								}
							}
						}
						if (!insertBeforePinned) {
							await moveTab(+el.id, {
								index: newIndex[i],
								windowId: +e.to.id
							});
						}
						deselectTab(el);
						if (tab.pinned) {
							e.to.insertBefore(el, e.to.children[e.oldIndex]);
							if (e.to.id !== e.from.id) await pinTab(+el.id);
						}
					}
				}
			}
		});
	});

	afterUpdate(() => {
		if (windowMenu) {
			if (!minimized) {
				const tabs = Array.from(windowMenu.querySelectorAll('.windowTab')) as HTMLElement[];
				for (const tab of tabs) {
					Sortable.utils.on(tab, 'contextmenu', handleRightClick);
				}
			}
		}
	});
</script>

<ul
	class="menu menu-xs rounded-lg max-w-xs h-fit w-full bg-base-200"
	style={`background-color: ${windowColor ? windowColor : ''}`}
>
	<WindowMenuNav {window} {i} {minimized} bind:windowColor />
	{#if window.tabs && !minimized}
		<ul
			class="windowMenu {gridView ? 'flex flex-wrap gap-2' : ''}
			{windowMenuMaxHeight <= 0 ? '' : 'overflow-y-auto'}"
			style={windowMenuMaxHeight <= 0 ? "" : `max-height: ${windowMenuMaxHeight}px`}
			id={window.id?.toString()}
			bind:this={windowMenu}
		>
			{#each window.tabs as tab (tab.id)}
				{#if !gridView}
					<li class="form-control w-full windowTab" id={tab.id?.toString()} data-id={tab.id}>
						<button
							class="label cursor-pointer justify-normal w-full bottomEndTippy"
							data-tippy-content={showUrl ? tab.url : tab.title}
						>
							<img src={tab.favIconUrl} alt="favicon" width="12" height="12" />
							<span class="label-text text-xs {showEntireTitle ? '' : 'truncate'}">
								{showUrl ? tab.url : tab.title}
							</span>
						</button>
					</li>
				{:else}
					<li class="form-control windowTab" id={tab.id?.toString()} data-id={tab.id}>
						<button
							class="label cursor-pointer justify-normal btn-xs btn-square relative bottomEndTippy"
							data-tippy-content={showUrl ? tab.url : tab.title}
						>
							<img
								src={tab.favIconUrl}
								alt="favicon"
								width="12"
								height="12"
								class="absolute left-1/4"
							/>
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</ul>
