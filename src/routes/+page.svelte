<script lang="ts">
	import { addTabEventListeners, removeTabEventListeners } from '$lib/chrome/tabs';
	import { addWindowEventListeners, removeWindowEventListeners } from '$lib/chrome/windows';
	import BottomNav from '$lib/components/popup/BottomNav.svelte';
	import TopNav from '$lib/components/popup/TopNav.svelte';
	import Window from '$lib/components/popup/Window.svelte';
	import { windowsStore } from '$lib/stores.svelte';

	$effect(() => {
		addWindowEventListeners();
		addTabEventListeners();

		return () => {
			removeWindowEventListeners();
			removeTabEventListeners();
		};
	});
</script>

{#await windowsStore.refreshWindows()}
	<p>loading...</p>
{:then windows}
	<div class="flex h-full w-full flex-col justify-between border bg-muted/40">
		<TopNav />

		<div class="h-full overflow-auto p-2">
			<div class="flex flex-wrap gap-2">
				{#each windowsStore.windows as window, i}
					<Window {window} {i} />
				{/each}
			</div>
		</div>

		<BottomNav />
	</div>
{:catch error}
	<p>error</p>
{/await}
