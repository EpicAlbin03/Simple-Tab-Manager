<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { getTab } from '$lib/chrome/tabs';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { Eye, EyeOff, Search } from '@lucide/svelte';
	import { iconProps } from '$lib/utils';
	import { shortcut } from '$lib/actions/shortcut.svelte';

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	let searchView = $derived(options.searchView);
	let listView = $derived(options.tabView === 'list');

	let searchValue = $state('');
	let searchInput = $state<HTMLInputElement>(null!);

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

<svelte:window use:shortcut={{ key: 'k', ctrl: true, callback: () => searchInput.focus() }} />

<div class="flex w-full max-w-xs gap-1">
	<InputGroup.Root>
		<InputGroup.Input
			type="search"
			placeholder="Search tabs..."
			class="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
			bind:value={searchValue}
			bind:ref={searchInput}
			oninput={async () => await search()}
		/>
		<InputGroup.Addon>
			<Search {...iconProps} />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<Kbd.Root>⌘</Kbd.Root>
			<Kbd.Root>K</Kbd.Root>
		</InputGroup.Addon>
	</InputGroup.Root>

	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					onclick={async () => {
						await optionStore.updateOptions({
							searchView: searchView === 'show' ? 'hide' : 'show'
						});
						await search();
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
