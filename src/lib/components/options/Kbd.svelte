<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet<[]>;
	};

	let { children }: Props = $props();
</script>

<kbd
	class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
>
	{@render children()}
</kbd>
