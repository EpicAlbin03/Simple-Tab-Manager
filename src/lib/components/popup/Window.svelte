<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Sortable from './Sortable.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Plus, ChevronUp, ChevronDown, X, ArrowUpAZ, ArrowDownZA } from '@lucide/svelte';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { minimizeWindow, removeWindow } from '$lib/chrome/windows';
	import { createEmptyTab, quickSort } from '$lib/chrome/tabs';
	import EditWindow from './EditWindow.svelte';
	import { iconProps } from '$lib/utils';

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
	class="h-fit w-full max-w-xs gap-0 bg-background py-0"
	style={window.color ? `border-color: hsl(${window.color})` : ''}
>
	<Card.Header class="flex flex-row items-center gap-2 space-y-0 p-4">
		<div class="flex w-full justify-between">
			<div class="flex items-center gap-2">
				<Card.Title class="max-w-36 truncate text-base">{window.name}</Card.Title>

				<div class="flex gap-0">
					<EditWindow {window} {i} />

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
										<ArrowDownZA {...iconProps} />
									{:else}
										<ArrowUpAZ {...iconProps} />
									{/if}
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							{#if options.sortDescending}
								<p>Sort Descending</p>
							{:else}
								<p>Sort Ascending</p>
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
									<Plus {...iconProps} />
								</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>New Tab</p>
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
									<ChevronDown {...iconProps} />
								{:else}
									<ChevronUp {...iconProps} />
								{/if}
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if minimized}
							<p>Maximize</p>
						{:else}
							<p>Minimize</p>
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
								<X {...iconProps} />
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Close</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</div>
	</Card.Header>

	<Card.Content class={`!pt-0 ${!minimized ? 'p-4' : 'p-0'}`}>
		{#if !minimized}
			<Sortable {window} />
		{/if}
	</Card.Content>
</Card.Root>
