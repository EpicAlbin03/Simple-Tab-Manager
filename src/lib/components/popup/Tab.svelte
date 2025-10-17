<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { VolumeX, Pin, Plus, RotateCw, Copy, Trash2 } from '@lucide/svelte';
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
	import { iconProps } from '$lib/utils';
	import Sortable from 'sortablejs';
	import type { LastClickedTabIndexStore } from '$lib/stores/last-selected-tab-store.svelte';
	import { WindowStoreContext, type WindowStore } from '$lib/stores/window-store.svelte';

	type Props = {
		tab: ChromeTab;
		i: number;
		sortableWindow: HTMLElement;
		listView: boolean;
		lastClickedTabIndexStore: LastClickedTabIndexStore;
	};

	let { tab, i, sortableWindow, listView, lastClickedTabIndexStore }: Props = $props();

	const windowStore: WindowStore = WindowStoreContext.get();
	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);

	function onMouseDown(event: MouseEvent) {
		// Avoid focus when pressing shift
		event.preventDefault();
	}

	async function onTabClick(event: MouseEvent, clickedTab: ChromeTab, clickedTabIndex: number) {
		if (event.metaKey || event.ctrlKey) {
			event.preventDefault();
			await openTab(clickedTab.id!, clickedTab.windowId);
		} else if (event.shiftKey && lastClickedTabIndexStore.lastClickedTabIndex !== undefined) {
			event.preventDefault();
			const sortableTabs = Array.from(sortableWindow.querySelectorAll('.tab')) as HTMLElement[];

			sortableTabs.forEach((tab) => Sortable.utils.deselect(tab));
			windowStore.clearPressedTabs(clickedTab.windowId);

			const start = Math.min(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);
			const end = Math.max(lastClickedTabIndexStore.lastClickedTabIndex, clickedTabIndex);

			for (let i = start; i <= end; i++) {
				Sortable.utils.select(sortableTabs[i]);
				windowStore.pressTab(parseInt(sortableTabs[i].id), parseInt(sortableWindow.id));
			}
		} else {
			lastClickedTabIndexStore.lastClickedTabIndex = clickedTabIndex;
		}
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger {...props}>
					{#snippet child({ props })}
						<Toggle
							{...props}
							size="sm"
							aria-label={tab.title}
							class={`w-full ${listView ? 'relative h-fit justify-start gap-2 py-1.5' : 'h-8 w-8'}`}
							bind:pressed={tab.pressed}
							onmousedown={onMouseDown}
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
										<VolumeX {...iconProps} />
									{/if}
									{#if tab.pinned}
										<Pin {...iconProps} />
									{/if}
								</span>
							{/if}
						</Toggle>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="max-w-[286px]">
					<p>{options.showTabUrl ? extractURL(tab.url!) : tab.title}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</ContextMenu.Trigger>

	<ContextMenu.Content>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await createEmptyTab(tab.windowId, tab.index + 1)}
		>
			<Plus {...iconProps} class="text-foreground" />
			New Tab
		</ContextMenu.Item>
		<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />
		<ContextMenu.Item class="gap-2" onclick={async () => await reloadTab(tab.id!)}>
			<RotateCw {...iconProps} class="text-foreground" />
			Reload
		</ContextMenu.Item>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await muteTab(tab.id!, !tab.mutedInfo?.muted)}
		>
			<VolumeX {...iconProps} class="text-foreground" />
			{tab.mutedInfo?.muted ? 'Unmute' : 'Mute'}
		</ContextMenu.Item>
		<ContextMenu.Item class="gap-2" onclick={async () => await pinTab(tab.id!, !tab.pinned)}>
			<Pin {...iconProps} class="text-foreground" />
			{tab.pinned ? 'Unpin' : 'Pin'}
		</ContextMenu.Item>
		<ContextMenu.Item
			class="gap-2"
			onclick={async () => await duplicateTab(tab.url!, tab.index + 1, tab.pinned)}
		>
			<Copy {...iconProps} class="text-foreground" />
			Duplicate
		</ContextMenu.Item>
		<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />
		<ContextMenu.Item class="gap-2" onclick={async () => await removeTab(tab.id!)}>
			<Trash2 {...iconProps} class="text-foreground" />
			Close
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
