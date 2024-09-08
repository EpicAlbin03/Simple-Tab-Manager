<script lang="ts">
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import EyeOpen from 'svelte-radix/EyeOpen.svelte';
	import EyeNone from 'svelte-radix/EyeNone.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { setOptions, type Options } from '$lib/chrome/storage';
	import { getContext } from 'svelte';

	const options: Options = getContext('options');
	let searchView = $state(options.searchView);

	let searchValue = $state('');
	let searchInput = $state() as HTMLInputElement;
	let kbd: HTMLElement;

	$effect(() => {
		function onKeydown(event: KeyboardEvent) {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				searchInput.focus();
			}
		}

		function onFocus(event: FocusEvent) {
			kbd.classList.add('hidden');
		}

		function onFocusout(event: FocusEvent) {
			kbd.classList.remove('hidden');
		}

		document.addEventListener('keydown', onKeydown);
		searchInput.addEventListener('focus', onFocus);
		searchInput.addEventListener('focusout', onFocusout);

		return () => {
			document.removeEventListener('keydown', onKeydown);
			searchInput.removeEventListener('focus', onFocus);
			searchInput.removeEventListener('focusout', onFocusout);
		};
	});

	function search() {
		const tabs = Array.from(document.querySelectorAll('.tab')) as HTMLElement[];
		for (const tab of tabs) {
			if (searchValue === '') {
				tab.classList.remove('opacity-30');
				tab.classList.remove('hidden');
			}

			if (tab.textContent?.toLowerCase().includes(searchValue.toLowerCase())) {
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
			placeholder="Search..."
			class="w-full bg-background pl-8"
			bind:value={searchValue}
			bind:inputRef={searchInput}
			oninput={search}
		/>
		<kbd
			bind:this={kbd}
			class="pointer-events-none absolute right-2.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
		>
			<span class="text-xs">⌘</span>K
		</kbd>
	</div>

	<Button
		variant="ghost"
		size="icon"
		onclick={async () => {
			searchView = searchView === 'show' ? 'hide' : 'show';
			search();
			await setOptions({ searchView });
		}}
	>
		{#if searchView === 'show'}
			<EyeOpen size="16" />
		{:else}
			<EyeNone size="16" />
		{/if}
	</Button>
</div>
