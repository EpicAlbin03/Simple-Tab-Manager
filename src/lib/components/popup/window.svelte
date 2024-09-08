<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Pencil2 from 'svelte-radix/Pencil2.svelte';
	import Plus from 'svelte-radix/Plus.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import CaretUp from 'svelte-radix/CaretUp.svelte';
	import CaretDown from 'svelte-radix/CaretDown.svelte';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import Sortable from './Sortable.svelte';
	import { createEmptyTab } from '$lib/chrome/tabs';
	import { removeWindow } from '$lib/chrome/windows';

	type Props = {
		window: ChromeWindow;
		i: number;
	};

	let { window, i }: Props = $props();

	let minimized = $derived(window.state === 'minimized');
</script>

<Card.Root class={`h-fit w-full max-w-xs ${window.focused ? 'border-card-foreground' : ''}`}>
	<Card.Header class="flex flex-row items-center gap-2 space-y-0 p-4">
		<div class="flex w-full justify-between">
			<div class="flex items-center gap-2">
				<Card.Title class="max-w-32 truncate text-base">Window {i + 1}</Card.Title>

				<div class="flex gap-0">
					<Button variant="ghost" size="icon" class="h-6 w-6">
						<Pencil2 class="h-4 w-4" />
					</Button>

					<Button variant="ghost" size="icon" class="h-6 w-6">
						<CaretSort class="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						class="h-6 w-6"
						onclick={async () => await createEmptyTab(window.id!)}
					>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div class="flex gap-0">
				<Button variant="ghost" size="icon" class="h-6 w-6">
					{#if minimized}
						<CaretDown class="h-4 w-4" />
					{:else}
						<CaretUp class="h-4 w-4" />
					{/if}
				</Button>

				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6"
					onclick={async () => await removeWindow(window.id!)}
				>
					<Cross2 class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</Card.Header>

	<Card.Content class={`!pt-0 ${!minimized ? 'p-4' : 'p-0'}`}>
		{#if !minimized}
			{#key window}
				<Sortable {window} />
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
