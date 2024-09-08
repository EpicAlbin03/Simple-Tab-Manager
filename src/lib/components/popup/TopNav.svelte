<script lang="ts">
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import { Button } from '$lib/components/ui/button';
	import { setOptions, type Options } from '$lib/chrome/storage';
	import { setTheme } from '$lib/theme';
	import { getContext } from 'svelte';

	const options: Options = getContext('options');
	let theme = $state(options.theme);

	$effect(() => {
		setTheme(theme);
	});
</script>

<div class="flex items-center justify-between border-b bg-background p-1">
	<div class="ml-auto flex gap-1">
		<Button variant="ghost" size="icon">
			<Gear size="16" />
		</Button>

		<Button
			variant="ghost"
			size="icon"
			onclick={async () => {
				theme = theme === 'light' ? 'dark' : 'light';
				setTheme(theme);
				setOptions({ theme });
			}}
		>
			{#if theme === 'light'}
				<Sun size="16" />
			{:else}
				<Moon size="16" />
			{/if}
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>
