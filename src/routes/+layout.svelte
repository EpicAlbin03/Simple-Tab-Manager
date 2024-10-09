<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { createOptionsStore } from '$lib/stores.svelte';
	import { setTheme } from '$lib/theme';
	import { Toaster } from '$lib/components/ui/sonner';

	const { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();
	const { options } = data;
	setTheme(options.theme);
	const optionsStore = createOptionsStore(options);
	setContext('optionsStore', optionsStore);
</script>

<Toaster duration={2000} />
{@render children()}
