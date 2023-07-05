<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-ignore
	import CloseOutline from 'svelte-ionicons/CloseOutline.svelte';
	// @ts-ignore
	import SearchOutline from 'svelte-ionicons/SearchOutline.svelte';

	let searchValue = '';
	let searchBar: HTMLInputElement;
	export let hideOnSearch = false;

	function handleSearch() {
		const tabs = Array.from(document.querySelectorAll('.windowTab')) as HTMLElement[];
		for (const tab of tabs) {
			if (tab.textContent?.toLowerCase().includes(searchValue.toLowerCase())) {
				if (tab.classList.contains('hidden')) tab.classList.remove('hidden');
				if (tab.classList.contains('opacity-30')) tab.classList.remove('opacity-30');
			} else {
				if (hideOnSearch) tab.classList.add('hidden');
				else tab.classList.add('opacity-30');
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			if (e.ctrlKey && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				searchBar.focus();
			}
		});
	});
</script>

<form class="flex items-center h-full w-fit relative">
	<SearchOutline size="16" class="absolute left-2" />
	<input
		type="text"
		placeholder="Search.."
		class="input input-bordered input-sm w-64 pl-8"
		bind:value={searchValue}
		bind:this={searchBar}
		on:keyup={handleSearch}
	/>
	<div class="flex absolute right-8 gap-1">
		<kbd class="kbd kbd-xs">CTRL</kbd>
		<kbd class="kbd kbd-xs">K</kbd>
	</div>
	<button
		class="btn btn-xs btn-circle absolute right-2 w-fit h-fit min-h-0 topTippy
		{searchValue === '' ? 'hidden' : ''}"
		data-tippy-content="Clear search"
	>
		<CloseOutline
			size="16"
			on:click={() => {
				searchValue = '';
				handleSearch();
			}}
		/>
	</button>
</form>
