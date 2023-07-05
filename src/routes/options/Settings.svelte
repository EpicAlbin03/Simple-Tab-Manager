<script lang="ts">
	import { handleTooltips } from '$lib/tooltips';
	import { beforeUpdate } from 'svelte';
	// @ts-ignore
	import RefreshOutline from 'svelte-ionicons/RefreshOutline.svelte';

	let windowMenuMaxHeight = 0;
	let showUrl = false;
	let showEntireTitle = false;
	let sortByUrl = false;
	let tooltips = true;
	let tooltipsDelay = 500;

	let windowMenuMaxHeightInput: HTMLInputElement;
	let tooltipsDelayInput: HTMLInputElement;

	async function saveWindowMenuMaxHeight(value: number) {
		windowMenuMaxHeight = value;
		await chrome.storage.sync.set({ windowMenuMaxHeight: windowMenuMaxHeight });
	}

	async function saveShowUrl(checked: boolean) {
		showUrl = checked;
		await chrome.storage.sync.set({ showUrl: checked });
	}

	async function saveShowEntireTitle(checked: boolean) {
		showEntireTitle = checked;
		await chrome.storage.sync.set({ showEntireTitle: checked });
	}

	async function saveSortByUrl(checked: boolean) {
		sortByUrl = checked;
		await chrome.storage.sync.set({ sortByUrl: checked });
	}

	async function saveTooltips(checked: boolean) {
		tooltips = checked;
		await chrome.storage.sync.set({ tooltips: checked });
		await handleTooltips();
	}

	async function saveTooltipsDelay(value: number) {
		tooltipsDelay = value;
		await chrome.storage.sync.set({ tooltipsDelay: tooltipsDelay });
		await handleTooltips();
	}

	async function resetSettings() {
		await saveWindowMenuMaxHeight(0);
		await saveShowUrl(false);
		await saveShowEntireTitle(false);
		await saveSortByUrl(false);
		await saveTooltips(true);
		await saveTooltipsDelay(500);
	}

	beforeUpdate(async () => {
		const windowMenuMaxHeightData = await chrome.storage.sync.get(`windowMenuMaxHeight`);
		const showUrlData = await chrome.storage.sync.get(`showUrl`);
		const showEntireTitleData = await chrome.storage.sync.get(`showEntireTitle`);
		const sortByUrlData = await chrome.storage.sync.get(`sortByUrl`);
		const tooltipsData = await chrome.storage.sync.get(`tooltips`);
		const tooltipsDelayData = await chrome.storage.sync.get(`tooltipsDelay`);
		windowMenuMaxHeight = windowMenuMaxHeightData.windowMenuMaxHeight ?? windowMenuMaxHeight;
		showUrl = showUrlData.showUrl ?? showUrl;
		showEntireTitle = showEntireTitleData.showEntireTitle ?? showEntireTitle;
		sortByUrl = sortByUrlData.sortByUrl ?? sortByUrl;
		tooltips = tooltipsData.tooltips ?? tooltips;
		tooltipsDelay = tooltipsDelayData.tooltipsDelay ?? tooltipsDelay;
	});
</script>

<ul>
	<li>
		<ul class="flex flex-col gap-2">
			<h2 class="card-title text-sm">Window menu</h2>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Set max height of window menu in pixels and enable scroll.</p>
				</div>
				<input
					type="number"
					min="0"
					step="25"
					class="input input-bordered input-xs w-full max-w-[4rem] pr-0 place-self-end"
					value={windowMenuMaxHeight}
					bind:this={windowMenuMaxHeightInput}
					on:change={async () => await saveWindowMenuMaxHeight(+windowMenuMaxHeightInput.value)}
				/>
			</li>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Show url instead of title.</p>
				</div>
				<input
					type="checkbox"
					class="toggle toggle-xs justify-self-end place-self-end"
					bind:checked={showUrl}
					on:change={async () => await saveShowUrl(showUrl)}
				/>
			</li>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Show the entire title or url.</p>
				</div>
				<input
					type="checkbox"
					class="toggle toggle-xs justify-self-end place-self-end"
					bind:checked={showEntireTitle}
					on:change={async () => await saveShowEntireTitle(showEntireTitle)}
				/>
			</li>
		</ul>
		<div class="divider col-span-4" />
	</li>
	<li>
		<ul class="flex flex-col gap-2">
			<h2 class="card-title text-sm">Quicksort</h2>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Sort by url instead of title.</p>
				</div>
				<input
					type="checkbox"
					class="toggle toggle-xs justify-self-end place-self-end"
					bind:checked={sortByUrl}
					on:change={async () => await saveSortByUrl(sortByUrl)}
				/>
			</li>
		</ul>
		<div class="divider col-span-4" />
	</li>
	<li>
		<ul class="flex flex-col gap-2">
			<h2 class="card-title text-sm">Tooltips</h2>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Enable tooltips.</p>
				</div>
				<input
					type="checkbox"
					class="toggle toggle-xs justify-self-end place-self-end"
					bind:checked={tooltips}
					on:change={async () => await saveTooltips(tooltips)}
				/>
			</li>
			<li class="grid grid-cols-4 items-center">
				<div class="col-span-3 pr-2">
					<p class="text-xs">Delay until tooltip is shown in ms.</p>
				</div>
				<input
					type="number"
					min="0"
					step="50"
					class="input input-bordered input-xs w-full max-w-[4rem] pr-0 place-self-end"
					value={tooltipsDelay}
					bind:this={tooltipsDelayInput}
					on:change={async () => await saveTooltipsDelay(+tooltipsDelayInput.value)}
					disabled={!tooltips}
				/>
			</li>
		</ul>
		<div class="divider col-span-4" />
	</li>
	<button
		class="btn btn-error btn-xs w-fit normal-case bottomTippy"
		data-tippy-content="Reset settings"
		on:click={async () => await resetSettings()}
	>
		<RefreshOutline size="16" />
		Reset settings
	</button>
</ul>
