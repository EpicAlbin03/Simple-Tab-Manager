<script lang="ts">
	import Sortable from 'sortablejs';
	import * as Sortablejs from 'sortablejs';
	const { MultiDrag } = Sortablejs;
	import { Toggle } from '$lib/components/ui/toggle';
	import { getContext } from 'svelte';
	import { moveTabs, openTab } from '$lib/chrome/tabs';
	import DrawingPin from 'svelte-radix/DrawingPin.svelte';
	import SpeakerOff from 'svelte-radix/SpeakerOff.svelte';
	import type { Options } from '$lib/chrome/storage';
	import { windowsStore } from '$lib/stores.svelte';
	import { isChromeExtension } from '$lib/chrome/utils';

	type Props = {
		window: ChromeWindow;
	};

	let { window }: Props = $props();
	let tabs = $derived(window.tabs);
	let sortableWindow = $state() as HTMLElement;

	const options: Options = getContext('options');
	let tabView = $derived(options.tabView);

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

					if (items) {
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

	async function _openTab(event: MouseEvent, tab: ChromeTab) {
		event.preventDefault();
		if (event.metaKey || event.ctrlKey) {
			await openTab(tab.id!, tab.windowId);
		}
	}

	function clearSelectedTabs() {
		const selectedTabs = Array.from(
			document.querySelectorAll('.sortable-selected')
		) as HTMLElement[];
		selectedTabs.forEach((tab) => {
			Sortable.utils.deselect(tab);
		});

		windowsStore.clearPressed();
	}
</script>

{#if window.id}
	<ul
		bind:this={sortableWindow}
		id={window.id.toString()}
		class={`${tabView === 'grid' ? 'flex gap-1' : ''}`}
	>
		{#if tabs}
			{#each tabs as tab, i}
				{#if tab.id}
					{#if tabView === 'list'}
						<li class="tab" id={tab.id.toString()}>
							<Toggle
								size="sm"
								aria-label={tab.title}
								class="relative w-full justify-start gap-2"
								bind:pressed={tab.pressed}
								onclick={(event) => _openTab(event, tab)}
							>
								<img src={tab.favIconUrl} alt={tab.title} width="12" height="12" class="absolute" />
								<span class="truncate pl-5">
									{tab.title}
								</span>
								<span class="ml-auto flex gap-2 pl-1">
									{#if tab.mutedInfo?.muted}
										<SpeakerOff class="h-4 w-4" />
									{/if}
									{#if tab.pinned}
										<DrawingPin class="h-4 w-4" />
									{/if}
								</span>
							</Toggle>
						</li>
					{:else}
						<li class="tab" id={tab.id.toString()}>
							<Toggle
								size="sm"
								aria-label={tab.title}
								bind:pressed={tab.pressed}
								onclick={(event) => _openTab(event, tab)}
							>
								<img src={tab.favIconUrl} alt={tab.title} width="12" height="12" />
							</Toggle>
						</li>
					{/if}
				{/if}
			{/each}
		{/if}
	</ul>
{/if}
