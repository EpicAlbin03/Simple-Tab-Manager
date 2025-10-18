<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { WindowStore, WindowStoreContext } from '$lib/stores/window-store.svelte';
	import { OptionStore, OptionStoreContext } from '$lib/stores/option-store.svelte';

	let { children } = $props();

	const windowStore = WindowStoreContext.set(new WindowStore());
	const optionStore = OptionStoreContext.set(new OptionStore());
</script>

<ModeWatcher />
<Toaster duration={2000} />
<Tooltip.Provider>
	{@render children?.()}
</Tooltip.Provider>
