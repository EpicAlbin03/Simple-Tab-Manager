<script lang="ts">
	// @ts-ignore
	import AddOutline from 'svelte-ionicons/AddOutline.svelte';
	// @ts-ignore
	import BookmarkOutline from 'svelte-ionicons/BookmarkOutline.svelte';
	// @ts-ignore
	import GridOutline from 'svelte-ionicons/GridOutline.svelte';
	// @ts-ignore
	import ListOutline from 'svelte-ionicons/ListOutline.svelte';
	// @ts-ignore
	import PinOutline from 'svelte-ionicons/PinOutline.svelte';
	// @ts-ignore
	import VolumeMuteOutline from 'svelte-ionicons/VolumeMuteOutline.svelte';
	// @ts-ignore
	import TrashOutline from 'svelte-ionicons/TrashOutline.svelte';
	// @ts-ignore
	import EyeOutline from 'svelte-ionicons/EyeOutline.svelte';
	// @ts-ignore
	import EyeOffOutline from 'svelte-ionicons/EyeOffOutline.svelte';
	import SearchBar from './SearchBar.svelte';
	import { createTab, muteSelectedTabs, pinSelectedTabs, removeSelectedTabs } from '$lib/chrome/tabs';
	import { selectedTabsStore, windowsStore } from '$lib/stores';
	import { createEmptyWindow } from '$lib/chrome/windows';
	import { beforeUpdate } from 'svelte';

	let gridView = false;
	let hideOnSearch = false;

	beforeUpdate(async () => {
		const gridData = await chrome.storage.sync.get('gridView');
		const hideData = await chrome.storage.sync.get('hideOnSearch');
		gridView = gridData.gridView ?? gridView;
		hideOnSearch = hideData.hideOnSearch ?? hideOnSearch;
	});

	async function toggleGridView() {
		await chrome.storage.sync.set({ gridView: gridView });
		windowsStore.reload?.();
	}

	async function toggleHideOnSearch() {
		await chrome.storage.sync.set({ hideOnSearch: hideOnSearch });
	}
</script>

<div class="h-10 bg-base-300">
	<ul class="h-10 w-full bg-base-300 flex flex-row-reverse float-right gap-2 items-center p-2">
		<li>
			<button
				class="btn btn-square btn-outline btn-sm topTippy"
				data-tippy-content={gridView ? 'List View' : 'Grid View'}
			>
				<label class="swap swap-rotate w-full h-full">
					<input
						type="checkbox"
						bind:checked={gridView}
						on:change={async () => await toggleGridView()}
					/>
					<ListOutline size="16" class="swap-on" />
					<GridOutline size="16" class="swap-off" />
				</label>
			</button>
		</li>
		<li>
			<button
				class="btn btn-square btn-error btn-sm topTippy"
				data-tippy-content="Close ({$selectedTabsStore.length}) tabs"
				on:click={async () => await removeSelectedTabs()}
			>
				<TrashOutline size="16" />
			</button>
		</li>
		<li>
			<button
				class="btn btn-square btn-warning btn-sm topTippy"
				data-tippy-content="Pin ({$selectedTabsStore.length}) tabs"
				on:click={async () => await pinSelectedTabs()}
			>
				<PinOutline size="16" />
			</button>
		</li>
		<li>
			<button
				class="btn btn-square btn-warning btn-sm topTippy"
				data-tippy-content="Mute ({$selectedTabsStore.length}) tabs"
				on:click={async () => await muteSelectedTabs()}
			>
				<VolumeMuteOutline size="16" />
			</button>
		</li>
		<li>
			<button
				class="btn btn-square btn-warning btn-sm topTippy"
				data-tippy-content="Bookmark manager"
				on:click={async () => await createTab({ url: 'chrome://bookmarks/' })}
			>
				<BookmarkOutline size="16" />
			</button>
		</li>
		<li>
			<button
				class="btn btn-square btn-success btn-sm topTippy"
				data-tippy-content="New window"
				on:click={async () => await createEmptyWindow()}
			>
				<AddOutline size="16" />
			</button>
		</li>
		<li class="mr-auto">
			<button
				class="btn btn-square btn-outline btn-sm topTippy"
				data-tippy-content={hideOnSearch ? "Don't hide" : 'Hide'}
			>
				<label class="swap swap-rotate w-full h-full">
					<input
						type="checkbox"
						bind:checked={hideOnSearch}
						on:change={async () => await toggleHideOnSearch()}
					/>
					<EyeOutline size="16" class="swap-on" />
					<EyeOffOutline size="16" class="swap-off" />
				</label>
			</button>
		</li>
		<li>
			<SearchBar {hideOnSearch} />
		</li>
	</ul>
</div>
