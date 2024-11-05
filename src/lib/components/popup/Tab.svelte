<script lang="ts">
	import { clearSelectedTabs, openTab } from '$lib/chrome/tabs';
	import {
		windowsStore,
		type LastClickedTabIndexStore,
		type OptionsStore
	} from '$lib/stores.svelte';
	import Sortable from 'sortablejs';
	import { Toggle } from '$lib/components/ui/toggle';
	import DrawingPin from 'svelte-radix/DrawingPin.svelte';
	import SpeakerOff from 'svelte-radix/SpeakerOff.svelte';
	import { getContext } from 'svelte';
	import { extractURL } from '$lib/chrome/utils';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	// TODO: Add context menu when bits-ui fixes it in svelte 5 rewrite
	// https://github.com/huntabyte/bits-ui/issues/563

	type Props = {
		tab: ChromeTab;
		i: number;
		sortableWindow: HTMLElement;
		listView: boolean;
		lastClickedTabIndexStore: LastClickedTabIndexStore;
	};

	let { tab, i, sortableWindow, listView, lastClickedTabIndexStore }: Props = $props();
	let pressed = $state(tab.pressed ?? false);

	const optionsStore: OptionsStore = getContext('optionsStore');
	const { showTabUrl, truncateTabTitle, tabView } = $derived(optionsStore.options);

	async function onTabClick(event: MouseEvent, clickedTab: ChromeTab, clickedTabIndex: number) {
		if (event.metaKey || event.ctrlKey) {
			await openTab(clickedTab.id!, clickedTab.windowId);
			clearSelectedTabs();
		} else if (event.shiftKey && lastClickedTabIndexStore.lastClickedTabIndex !== undefined) {
			const sortableTabs = Array.from(sortableWindow.querySelectorAll('.tab')) as HTMLElement[];

			const start = Math.min(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);
			const end = Math.max(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);
			clearSelectedTabs(clickedTab.windowId);
			for (let i = start; i <= end; i++) {
				Sortable.utils.select(sortableTabs[i]);
				windowsStore.pressTab(parseInt(sortableTabs[i].id), parseInt(sortableWindow.id));
			}
		} else {
			lastClickedTabIndexStore.lastClickedTabIndex = clickedTabIndex;
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props} class={listView ? '' : 'h-8 w-8'}>
				<Toggle
					size="sm"
					aria-label={tab.title}
					class={`w-full ${listView ? 'relative h-fit justify-start gap-2 py-1.5' : 'h-full'}`}
					bind:pressed
					onclick={(event) => onTabClick(event, tab, i)}
				>
					<img
						src={tab.favIconUrl}
						alt={tab.title}
						height="12"
						width="12"
						class={`h-3 w-3 ${listView ? 'absolute' : ''}`}
					/>
					{#if listView}
						<span class={`pl-5 text-start ${truncateTabTitle ? 'truncate' : ''}`}>
							{showTabUrl ? extractURL(tab.url!) : tab.title}
						</span>
						<span class="ml-auto flex gap-2 pl-1">
							{#if tab.mutedInfo?.muted}
								<SpeakerOff size="16" />
							{/if}
							{#if tab.pinned}
								<DrawingPin size="16" />
							{/if}
						</span>
					{/if}
				</Toggle>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content side="top" class="max-w-[286px]">
		<p>{showTabUrl ? extractURL(tab.url!) : tab.title}</p>
	</Tooltip.Content>
</Tooltip.Root>
