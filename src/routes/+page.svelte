<script lang="ts">
	import { WindowStore, WindowStoreContext } from '$lib/stores/window-store.svelte';
	import Window from '$lib/components/popup/Window.svelte';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/popup/BottomNav.svelte';
	import TopNav from '$lib/components/popup/TopNav.svelte';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	const windowStore: WindowStore = WindowStoreContext.get();

	onMount(() => {
		windowStore.addListeners();

		return () => {
			windowStore.removeListeners();
		};
	});
</script>

<div class="flex h-full w-full flex-col bg-muted/40">
	<TopNav />

	<div class="flex-1 overflow-hidden">
		<ScrollArea class="flex h-full flex-wrap gap-2 p-2">
			<div class="flex flex-wrap gap-2">
				{#if windowStore.isLoading}
					<Spinner />
				{:else}
					{#each windowStore.windows as window, i}
						<Window {window} {i} />
					{/each}
				{/if}
			</div>
		</ScrollArea>
	</div>

	<BottomNav />
</div>
