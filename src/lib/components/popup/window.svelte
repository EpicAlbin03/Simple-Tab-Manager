<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Plus from 'svelte-radix/Plus.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import CaretUp from 'svelte-radix/CaretUp.svelte';
	import CaretDown from 'svelte-radix/CaretDown.svelte';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import Sortable from './Sortable.svelte';
	import { createEmptyTab, quickSort } from '$lib/chrome/tabs';
	import { minimizeWindow, removeWindow } from '$lib/chrome/windows';
	import EditWindow from './EditWindow.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { getContext } from 'svelte';
	import type { OptionsStore } from '$lib/stores.svelte';

	type Props = {
		window: ChromeWindow;
		i: number;
	};

	let { window, i }: Props = $props();

	let minimized = $derived(window.state === 'minimized');
	// TODO: highlight focused window

	const optionsStore: OptionsStore = getContext('optionsStore');
	const { sortByUrl, sortDescending } = $derived(optionsStore.options);
	const sortingOption = $derived(sortByUrl ? 'url' : 'title');
</script>

<Card.Root
	class={`h-fit w-full max-w-xs ${window.focused ? '' : ''}`}
	style={window.color ? `border-color: hsl(${window.color})` : ''}
>
	<Card.Header class="flex flex-row items-center gap-2 space-y-0 p-4">
		<div class="flex w-full justify-between">
			<div class="flex items-center gap-2">
				<Card.Title class="max-w-36 truncate text-base">{window.name}</Card.Title>

				<div class="flex gap-0">
					{#key window.name || window.color}
						<EditWindow {window} {i} />
					{/key}

					<Tooltip.Root group>
						<Tooltip.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								size="icon"
								class="h-6 w-6"
								onclick={async () => await quickSort(window, sortingOption, sortDescending)}
							>
								<CaretSort size="16" />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Quicksort</p>
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root group>
						<Tooltip.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								size="icon"
								class="h-6 w-6"
								onclick={async () => await createEmptyTab(window.id!)}
							>
								<Plus size="16" />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>New tab</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>

			<div class="flex gap-0">
				<Tooltip.Root group>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							size="icon"
							class="h-6 w-6"
							onclick={async () => await minimizeWindow(window.id!, !minimized)}
						>
							{#if minimized}
								<CaretDown size="16" />
							{:else}
								<CaretUp size="16" />
							{/if}
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if minimized}
							<p>Maximize window</p>
						{:else}
							<p>Minimize window</p>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root group>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							size="icon"
							class="h-6 w-6"
							onclick={async () => await removeWindow(window.id!)}
						>
							<Cross2 size="16" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Close window</p>
					</Tooltip.Content>
				</Tooltip.Root>
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
