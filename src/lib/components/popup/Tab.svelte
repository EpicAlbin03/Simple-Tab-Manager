<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { VolumeX, Pin, Plus, RotateCw, Copy, X } from '@lucide/svelte';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { extractURL } from '$lib/chrome/utils';
	import {
		createEmptyTab,
		duplicateTab,
		muteTab,
		openTab,
		pinTab,
		reloadTab,
		removeTab
	} from '$lib/chrome/tabs';

	type Props = {
		tab: ChromeTab;
		i: number;
		sortableWindow: HTMLElement;
		listView: boolean;
	};

	let { tab, i, sortableWindow, listView }: Props = $props();
	let pressed = $state(tab.pressed ?? false);

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);

	async function onTabClick(event: MouseEvent, clickedTab: ChromeTab, clickedTabIndex: number) {
		if (event.metaKey || event.ctrlKey) {
			await openTab(clickedTab.id!, clickedTab.windowId);
			// clearSelectedTabs();
		}
		// else if (event.shiftKey && lastClickedTabIndexStore.lastClickedTabIndex !== undefined) {
		// 	const sortableTabs = Array.from(sortableWindow.querySelectorAll('.tab')) as HTMLElement[];

		// 	const start = Math.min(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);
		// 	const end = Math.max(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);
		// 	clearSelectedTabs(clickedTab.windowId);
		// 	for (let i = start; i <= end; i++) {
		// 		Sortable.utils.select(sortableTabs[i]);
		// 		windowsStore.pressTab(parseInt(sortableTabs[i].id), parseInt(sortableWindow.id));
		// 	}
		// } else {
		// 	lastClickedTabIndexStore.lastClickedTabIndex = clickedTabIndex;
		// }
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
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
								<span class={`pl-5 text-start ${options.truncateTabTitle ? 'truncate' : ''}`}>
									{options.showTabUrl ? extractURL(tab.url!) : tab.title}
								</span>
								<span class="ml-auto flex gap-2 pl-1">
									{#if tab.mutedInfo?.muted}
										<VolumeX size="16" />
									{/if}
									{#if tab.pinned}
										<Pin size="16" />
									{/if}
								</span>
							{/if}
						</Toggle>
					</div>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="max-w-[286px]">
				<p>{options.showTabUrl ? extractURL(tab.url!) : tab.title}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</ContextMenu.Trigger>

	<ContextMenu.Content>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await createEmptyTab(tab.windowId, tab.index + 1)}
		>
			<Plus size="16" />
			New Tab Below
		</ContextMenu.Item>
		<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />
		<ContextMenu.Item class="gap-2" onclick={async () => await reloadTab(tab.id!)}>
			<RotateCw size="16" />
			Reload Tab
		</ContextMenu.Item>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await muteTab(tab.id!, !tab.mutedInfo?.muted)}
		>
			<VolumeX size="16" />
			{tab.mutedInfo?.muted ? 'Unmute' : 'Mute'} Tab
		</ContextMenu.Item>
		<ContextMenu.Item class="gap-2" onclick={async () => await pinTab(tab.id!, !tab.pinned)}>
			<Pin size="16" />
			{tab.pinned ? 'Unpin' : 'Pin'} Tab
		</ContextMenu.Item>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await duplicateTab(tab.url!, tab.index + 1, tab.pinned)}
		>
			<Copy size="16" />
			Duplicate Tab
		</ContextMenu.Item>
		<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />
		<ContextMenu.Item class="gap-2" onclick={async () => await removeTab(tab.id!)}>
			<X size="16" />
			Close Tab
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
