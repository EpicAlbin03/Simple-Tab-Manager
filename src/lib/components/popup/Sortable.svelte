<script lang="ts">
	import Sortable from 'sortablejs';
	import * as Sortablejs from 'sortablejs';
	import Tab from './Tab.svelte';
	import { moveTabs } from '$lib/chrome/tabs';
	import { onDestroy, onMount } from 'svelte';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { createLastClickedTabIndexStore } from '$lib/stores/last-selected-tab-store.svelte';
	const { MultiDrag } = Sortablejs;

	type Props = {
		window: ChromeWindow;
	};

	let { window }: Props = $props();
	let tabs = $derived(window.tabs);
	let sortableWindow = $state<HTMLElement>(null!);
	let sortableInstance = $state<Sortable>(null!);

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	let listView = $derived(options.tabView === 'list');

	const lastClickedTabIndexStore = createLastClickedTabIndexStore();

	onMount(() => {
		try {
			Sortable.mount(new MultiDrag());
		} catch (error) {}

		sortableInstance = new Sortable(sortableWindow, {
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
		});
	});

	onDestroy(() => {
		sortableInstance?.destroy();
	});
</script>

{#if window.id}
	<ul
		bind:this={sortableWindow}
		id={window.id.toString()}
		data-testid={window.id.toString()}
		class={`overflow-x-hidden ${listView ? '' : 'flex flex-wrap'} ${options.windowMaxHeight > 0 ? '' : 'overflow-y-hidden'}`}
		style={options.windowMaxHeight > 0
			? `max-height: ${options.windowMaxHeight}px; overflow-y: auto;`
			: undefined}
	>
		{#if tabs}
			{#each tabs as tab, i (tab.id)}
				{#if tab.id}
					<li class="tab" id={tab.id.toString()} data-testid={tab.id.toString()}>
						<Tab {tab} {i} {sortableWindow} {listView} {lastClickedTabIndexStore} />
					</li>
				{/if}
			{/each}
		{/if}
	</ul>
{/if}
