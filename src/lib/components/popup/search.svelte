<script lang="ts">
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import EyeOpen from 'svelte-radix/EyeOpen.svelte';
	import EyeNone from 'svelte-radix/EyeNone.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { getContext } from 'svelte';
	import type { OptionsStore } from '$lib/stores.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { onFocusoutSearch, onFocusSearch, onSearch } from '$lib/shortcuts';
	import { getTab } from '$lib/chrome/tabs';

	const optionsStore: OptionsStore = getContext('optionsStore');
	let searchView = $state(optionsStore.options.searchView);
	let listView = $derived(optionsStore.options.tabView === 'list');

	let searchValue = $state('');
	let searchInput = $state(null) as HTMLInputElement | null;
	let kbd: HTMLElement;

	$effect(() => {
		if (searchInput) {
			document.addEventListener('keydown', (event: KeyboardEvent) => onSearch(event, searchInput));
			searchInput.addEventListener('focus', (event: FocusEvent) => onFocusSearch(event, kbd));
			searchInput.addEventListener('focusout', (event: FocusEvent) => onFocusoutSearch(event, kbd));
		}

		return () => {
			if (searchInput) {
				document.removeEventListener('keydown', (event: KeyboardEvent) =>
					onSearch(event, searchInput)
				);
				searchInput.removeEventListener('focus', (event: FocusEvent) => onFocusSearch(event, kbd));
				searchInput.removeEventListener('focusout', (event: FocusEvent) =>
					onFocusoutSearch(event, kbd)
				);
			}
		};
	});

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

<div class="flex w-full gap-1">
	<div class="relative flex w-full max-w-60 items-center">
		<MagnifyingGlass class="absolute left-2.5 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search tabs..."
			class="w-full bg-background pl-8"
			bind:value={searchValue}
			bind:ref={searchInput}
			oninput={async () => await search()}
		/>
		<kbd
			bind:this={kbd}
			class="pointer-events-none absolute right-2.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
		>
			<span class="text-xs">⌘</span>K
		</kbd>
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
						optionsStore.updateOptions({ searchView });
					}}
				>
					{#if searchView === 'show'}
						<EyeOpen size="16" />
					{:else}
						<EyeNone size="16" />
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
