<script lang="ts">
	import { getColors } from '$lib/colors';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';
	import Pencil2 from 'svelte-radix/Pencil2.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { windowsStore } from '$lib/stores.svelte';
	import { setSessionStorageItem } from '$lib/chrome/storage';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type Props = {
		window: ChromeWindow;
		i: number;
	};

	let { window, i }: Props = $props();

	let twColors = getColors();
	let name = $state(window.name);
	let color = $state(window.color ?? 'default');
	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-6 w-6')}>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" class="h-6 w-6">
						<Pencil2 size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p class="font-normal">Edit window</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit window</Dialog.Title>
		</Dialog.Header>

		<div class="grid gap-8 py-4">
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="name">Name</Label>
				<Input id="name" bind:value={name} />
			</div>

			<div class="grid w-full max-w-sm items-center gap-4">
				<Label for="color">Border color</Label>
				<RadioGroup.Root bind:value={color}>
					<div class="scrollable flex h-48 w-full flex-col gap-2 overflow-y-scroll">
						<div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="default" id="default" class="h-6 w-6" />
								<Label for="default">Default</Label>
							</div>
						</div>

						{#each twColors as color}
							{#if color}
								<div class="flex gap-2">
									{#each color.colors as scale}
										<RadioGroup.Item
											value={scale.hsl}
											id={scale.id}
											style={`
												background-color: hsl(${scale.hsl});
												color: ${scale.foreground}
												`}
											class="h-6 w-6 border-primary-foreground"
										/>
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				</RadioGroup.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Button
				onclick={async () => {
					windowsStore.windows[i].name = name;
					windowsStore.windows[i].color = color;
					await setSessionStorageItem(
						`window-${windowsStore.windows[i].id}`,
						JSON.stringify({ name, color })
					);
					open = false;
				}}>Save</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
