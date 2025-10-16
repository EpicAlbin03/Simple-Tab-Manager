<script lang="ts">
	import { VolumeX, Pin, Plus, Bookmark, LayoutGrid, LayoutList, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { createEmptyWindow } from '$lib/chrome/windows';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { createTab, removeTabs, toggleMuteTabs, togglePinTabs } from '$lib/chrome/tabs';
	import { setOptions } from '$lib/chrome/storage';
	import { WindowStoreContext, type WindowStore } from '$lib/stores/window-store.svelte';
	import Searchbar from './SearchBar.svelte';
	import { iconProps } from '$lib/utils';

	const windowStore: WindowStore = WindowStoreContext.get();
	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	const pressedTabs = $derived(windowStore.getPressedTabs());
	const pressedTabIds = $derived(pressedTabs.map((tab) => tab.id!));
</script>

<div class="flex items-center justify-between border-t bg-background p-2">
	<Searchbar />

	<div class="flex gap-1">
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await createEmptyWindow()}
					>
						<Plus {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>New Window</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await createTab('chrome://bookmarks/')}
					>
						<Bookmark {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Bookmark Manager</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await toggleMuteTabs(pressedTabs)}
					>
						<VolumeX {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Mute ({pressedTabs.length}) Tabs</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await togglePinTabs(pressedTabs)}
					>
						<Pin {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Pin ({pressedTabs.length}) Tabs</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await removeTabs(pressedTabIds)}
					>
						<Trash2 {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Close ({pressedTabs.length}) Tabs</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => {
							options.tabView = options.tabView === 'list' ? 'grid' : 'list';
							await setOptions({ tabView: options.tabView });
						}}
					>
						{#if options.tabView === 'list'}
							<LayoutList {...iconProps} />
						{:else}
							<LayoutGrid {...iconProps} />
						{/if}
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if options.tabView === 'list'}
					<p>Grid View</p>
				{:else}
					<p>List View</p>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
