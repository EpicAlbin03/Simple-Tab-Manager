<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Sortable from './Sortable.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Plus, ChevronUp, ChevronDown, X, ArrowUpAZ, ArrowDownZA } from '@lucide/svelte';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { minimizeWindow, removeWindow } from '$lib/chrome/windows';
	import { createEmptyTab, quickSort } from '$lib/chrome/tabs';

	type Props = {
		window: ChromeWindow;
		i: number;
	};

	let { window, i }: Props = $props();

	let minimized = $derived(window.state === 'minimized');

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	const sortingOption = $derived(options.sortByUrl ? 'url' : 'title');
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
					<!-- {#key window.name || window.color}
						<EditWindow {window} {i} />
					{/key} -->

					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={async () =>
										await quickSort(window, sortingOption, options.sortDescending)}
								>
									{#if options.sortDescending}
										<ArrowDownZA size="16" />
									{:else}
										<ArrowUpAZ size="16" />
									{/if}
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							{#if options.sortDescending}
								<p>Sort descending</p>
							{:else}
								<p>Sort ascending</p>
							{/if}
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon"
									class="h-6 w-6"
									onclick={async () => await createEmptyTab(window.id!)}
								>
									<Plus size="16" />
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>New tab</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>

			<div class="flex gap-0">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="h-6 w-6"
								onclick={async () => await minimizeWindow(window.id!, !minimized)}
							>
								{#if minimized}
									<ChevronDown size="16" />
								{:else}
									<ChevronUp size="16" />
								{/if}
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if minimized}
							<p>Maximize window</p>
						{:else}
							<p>Minimize window</p>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="h-6 w-6"
								onclick={async () => await removeWindow(window.id!)}
							>
								<X size="16" />
							</Button>
						{/snippet}
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
