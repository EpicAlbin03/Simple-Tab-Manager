<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		desc: string;
		children: Snippet<[]>;
	};

	let { desc, children }: Props = $props();
</script>

<div class="flex items-center justify-between space-x-2">
	<div class="space-y-0.5">
		<p class="text-[0.8rem] text-muted-foreground">
			{@html desc}
		</p>
	</div>
	{@render children()}
</div>
