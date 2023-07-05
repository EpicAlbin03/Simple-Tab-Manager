<script lang="ts">
	import WindowMenu from './WindowMenu.svelte';
	import { addWindowEventListeners } from '$lib/chrome/windows';
	import { afterUpdate, onMount } from 'svelte';
	import { addGridRowSpan } from '$lib/popup';
	// @ts-ignore
	import CloseCircleOutline from 'svelte-ionicons/CloseCircleOutline.svelte';
	import BottomNav from './BottomNav.svelte';
	import TopNav from './TopNav.svelte';
	import { addTabEventListeners } from '$lib/chrome/tabs';
	import Sortable, { MultiDrag } from 'sortablejs';
	import { windowsStore } from '$lib/stores';
	import { handleTooltips } from '$lib/tooltips';

	onMount(async () => {
		try {
			Sortable.mount(new MultiDrag());
		} catch (error) {}
		addWindowEventListeners();
		addTabEventListeners();
	});

	afterUpdate(async () => {
		addGridRowSpan();
		await handleTooltips();
	});
</script>

<div class="h-full w-full">
	<TopNav />
	<div class="h-[500px] overflow-auto">
		{#await $windowsStore}
			<div class="flex justify-center items-center h-full">
				<span class="loading loading-spinner" />
			</div>
		{:then windows}
			<div class="grid grid-cols-[repeat(auto-fit,_minmax(0,_20rem))] gap-2 p-2">
				{#each windows as window, i (window.id)}
					<WindowMenu {window} {i} />
				{/each}
			</div>
		{:catch error}
			<div class="flex justify-center items-center h-full">
				<div class="badge badge-error badge-lg gap-2 text-sm">
					<CloseCircleOutline size="16" />
					Error loading windows. Please try again!
				</div>
			</div>
		{/await}
	</div>
	<BottomNav />
</div>
