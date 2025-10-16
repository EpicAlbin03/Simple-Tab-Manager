<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { getTab } from '$lib/chrome/tabs';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { Eye, EyeOff, Search } from '@lucide/svelte';
	import { setOptions } from '$lib/chrome/storage';
	import { iconProps } from '$lib/utils';

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	let searchView = $derived(options.searchView);
	let listView = $derived(options.tabView === 'list');

	let searchValue = $state('');
	let searchInput = $state<HTMLInputElement>(null!);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchInput.focus();
		}
	}

	async function search() {
		const tabs = Array.from(document.querySelectorAll('.tab')) as HTMLElement[];
		for (const tab of tabs) {
			if (searchValue === '') {
				tab.classList.remove('opacity-30');
				tab.classList.remove('hidden');
			}

			let b: boolean | undefined;
			if (listView) {
				b = tab.textContent?.toLowerCase().includes(searchValue.toLowerCase());
			} else {
				const chromeTab = await getTab(parseInt(tab.id));
				b = chromeTab.title?.toLowerCase().includes(searchValue.toLowerCase());
			}

			if (b) {
				if (searchView === 'hide') tab.classList.remove('opacity-30');
				else tab.classList.remove('hidden');
			} else {
				if (searchView === 'hide') {
					tab.classList.remove('opacity-30');
					tab.classList.add('hidden');
				} else {
					tab.classList.remove('hidden');
					tab.classList.add('opacity-30');
				}
			}
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="flex w-full gap-1">
	<div class="relative">
		<div
			class="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground peer-disabled:opacity-50"
		>
			<Search {...iconProps} />
			<span class="sr-only">Search</span>
		</div>
		<Input
			type="search"
			placeholder="Search tabs..."
			class="peer px-9 pe-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
			bind:value={searchValue}
			bind:ref={searchInput}
			oninput={async () => await search()}
		/>
		<div
			class="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50"
		>
			<kbd
				class="inline-flex h-5 max-h-full items-center rounded border bg-accent px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground"
			>
				⌘ K
			</kbd>
		</div>
	</div>

	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					onclick={async () => {
						searchView = searchView === 'show' ? 'hide' : 'show';
						await search();
						await setOptions({ searchView });
					}}
				>
					{#if searchView === 'show'}
						<Eye {...iconProps} />
					{:else}
						<EyeOff {...iconProps} />
					{/if}
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{#if searchView === 'show'}
				<p>Hide Tabs</p>
			{:else}
				<p>Show Tabs</p>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</div>
