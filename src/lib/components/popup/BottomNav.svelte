<script lang="ts">
	import Grid from 'svelte-radix/Grid.svelte';
	import ListBullet from 'svelte-radix/ListBullet.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Plus from 'svelte-radix/Plus.svelte';
	import Bookmark from 'svelte-radix/Bookmark.svelte';
	import SpeakerOff from 'svelte-radix/SpeakerOff.svelte';
	import DrawingPin from 'svelte-radix/DrawingPin.svelte';
	import Search from '$lib/components/popup/Search.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';
	import { createEmptyWindow } from '$lib/chrome/windows';
	import type { OptionsStore } from '$lib/stores.svelte';
	import {
		createTab,
		getSelectedTabs,
		muteSelectedTabs,
		togglePinSelectedTabs,
		removeSelectedTabs
	} from '$lib/chrome/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import {
		onBookmarkManager,
		onCloseTabs,
		onMuteTabs,
		onNewWindow,
		onPinTabs
	} from '$lib/shortcuts';

	const optionsStore: OptionsStore = getContext('optionsStore');
	let tabView = $state(optionsStore.options.tabView);

	$effect(() => {
		document.addEventListener('keydown', onNewWindow);
		document.addEventListener('keydown', onBookmarkManager);
		document.addEventListener('keydown', onMuteTabs);
		document.addEventListener('keydown', onPinTabs);
		document.addEventListener('keydown', onCloseTabs);

		return () => {
			document.removeEventListener('keydown', onNewWindow);
			document.removeEventListener('keydown', onBookmarkManager);
			document.removeEventListener('keydown', onMuteTabs);
			document.removeEventListener('keydown', onPinTabs);
			document.removeEventListener('keydown', onCloseTabs);
		};
	});
</script>

<div class="flex items-center justify-between border-t bg-background p-1">
	<Search />

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
						<Plus size="16" />
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
						<Bookmark size="16" />
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
						onclick={async () => await muteSelectedTabs()}
					>
						<SpeakerOff size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Mute ({getSelectedTabs().length}) Tabs</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await togglePinSelectedTabs()}
					>
						<DrawingPin size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Pin ({getSelectedTabs().length}) Tabs</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => await removeSelectedTabs()}
					>
						<Trash size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Close ({getSelectedTabs().length}) Tabs</p>
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
							tabView = tabView === 'list' ? 'grid' : 'list';
							optionsStore.updateOptions({ tabView });
						}}
					>
						{#if tabView === 'list'}
							<ListBullet size="16" />
						{:else}
							<Grid size="16" />
						{/if}
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if tabView === 'list'}
					<p>Grid View</p>
				{:else}
					<p>List View</p>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
