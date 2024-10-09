<script lang="ts">
	import Sortable from 'sortablejs';
	import * as Sortablejs from 'sortablejs';
	const { MultiDrag } = Sortablejs;
	import { getContext } from 'svelte';
	import { clearSelectedTabs, moveTabs } from '$lib/chrome/tabs';
	import {
		createLastClickedTabIndexStore,
		windowsStore,
		type OptionsStore
	} from '$lib/stores.svelte';
	import { isChromeExtension } from '$lib/chrome/utils';
	import Tab from './Tab.svelte';

	type Props = {
		window: ChromeWindow;
	};

	let { window }: Props = $props();
	let tabs = $derived(window.tabs);
	let sortableWindow = $state() as HTMLElement;

	const lastClickedTabIndexStore = createLastClickedTabIndexStore();

	const optionsStore: OptionsStore = getContext('optionsStore');
	const { windowMaxHeight, tabView } = $derived(optionsStore.options);
	let listView = $derived(tabView === 'list');

	$effect(() => {
		try {
			Sortable.mount(new MultiDrag());
		} catch (error) {}

		const sortable = new Sortable(sortableWindow, {
			group: 'shared',
			animation: 150,
			swapThreshold: 0.65,
			multiDrag: true,
			selectedClass: 'sortable-selected',
			fallbackTolerance: 3,
			avoidImplicitDeselect: true,
			scroll: true,
			forceAutoScrollFallback: true,
			scrollSensitivity: 50,
			scrollSpeed: 10,
			bubbleScroll: true,

			onEnd: async (event) => {
				if (isChromeExtension()) {
					const { newIndex, oldIndex, newIndicies, oldIndicies, item, items, to, from } = event;
					const windowId = parseInt(to.id);

					if (newIndex === undefined || oldIndex === undefined) return;

					if (items.length <= 1) {
						newIndicies.push({ multiDragElement: item, index: newIndex });
						oldIndicies.push({ multiDragElement: item, index: oldIndex });
						items.push(item);
					}

					await moveTabs(items, windowId, newIndicies, oldIndicies);
				}

				clearSelectedTabs();
				windowsStore.refreshWindows();
			}
		});
	});
</script>

{#if window.id}
	<ul
		bind:this={sortableWindow}
		id={window.id.toString()}
		class={`scrollable ${listView ? '' : 'flex flex-wrap'}`}
		style={windowMaxHeight > 0 ? `max-height: ${windowMaxHeight}px` : ''}
	>
		{#if tabs}
			{#each tabs as tab, i}
				{#if tab.id}
					<li class="tab" id={tab.id.toString()}>
						<Tab {tab} {i} {sortableWindow} {listView} {lastClickedTabIndexStore} />
					</li>
				{/if}
			{/each}
		{/if}
	</ul>
{/if}
