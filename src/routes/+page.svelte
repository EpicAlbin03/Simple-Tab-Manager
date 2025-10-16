<script lang="ts">
	import { WindowStore, WindowStoreContext } from '$lib/stores/window-store.svelte';
	import Window from '$lib/components/popup/Window.svelte';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/popup/BottomNav.svelte';
	import TopNav from '$lib/components/popup/TopNav.svelte';

	const windowStore: WindowStore = WindowStoreContext.get();

	onMount(() => {
		windowStore.addListeners();

		return () => {
			windowStore.removeListeners();
		};
	});
</script>

{#if windowStore.isLoading}
	<p>Loading...</p>
{:else}
	<div class="flex h-full w-full flex-col justify-between bg-muted/40">
		<TopNav />

		<div class="scrollable h-full overflow-auto p-2">
			<div class="flex flex-wrap gap-2">
				{#each windowStore.windows as window, i}
					<Window {window} {i} />
				{/each}
			</div>
		</div>

		<BottomNav />
	</div>
{/if}
