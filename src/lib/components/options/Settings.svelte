<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Reset from 'svelte-radix/Reset.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/options/FormField.svelte';
	import type { OptionsStore } from '$lib/stores.svelte';
	import { getContext } from 'svelte';
	import { defaultSettings } from '$lib/chrome/storage';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { toast } from 'svelte-sonner';

	const optionsStore: OptionsStore = getContext('optionsStore');

	let windowMaxHeight = $state(optionsStore.options.windowMaxHeight);
	let showTabUrl = $state(optionsStore.options.showTabUrl);
	let sortByUrl = $state(optionsStore.options.sortByUrl);
	let sortDescending = $state(optionsStore.options.sortDescending);
	let disableTooltips = $state(optionsStore.options.disableTooltips);
	let truncateTabTitle = $state(optionsStore.options.truncateTabTitle);
</script>

<Card.Root>
	<Card.Content class="mt-4 space-y-2">
		<div class="flex flex-col gap-4">
			<legend class="text-base font-medium">Window</legend>
			<FormField desc="Max window height before scroll (px) <br> 1 row = 32px, default = 0">
				<Input
					type="number"
					min="0"
					max="9999"
					step="32"
					class="max-w-20"
					bind:value={windowMaxHeight}
				/>
			</FormField>
			<FormField desc="Show tab url instead of title">
				<Switch bind:checked={showTabUrl} />
			</FormField>
			<FormField desc="Truncate tab title or url">
				<Switch bind:checked={truncateTabTitle} />
			</FormField>

			<Separator orientation="horizontal" class="my-2" />
			<legend class="text-base font-medium">Quicksort</legend>
			<FormField desc="Sort by url instead of title">
				<Switch bind:checked={sortByUrl} />
			</FormField>
			<FormField desc="Descending order">
				<Switch bind:checked={sortDescending} />
			</FormField>

			<Separator orientation="horizontal" class="my-2" />
			<legend class="text-base font-medium">Tooltips</legend>
			<FormField desc="Disable tooltips">
				<Switch bind:checked={disableTooltips} />
			</FormField>
		</div>
	</Card.Content>

	<Card.Footer class="flex justify-between">
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="destructive">
						<Reset size="16" class="mr-2" />
						Reset
					</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will reset all settings back to default.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="destructive"
								onclick={async () => {
									windowMaxHeight = defaultSettings.windowMaxHeight;
									showTabUrl = defaultSettings.showTabUrl;
									sortByUrl = defaultSettings.sortByUrl;
									sortDescending = defaultSettings.sortDescending;
									disableTooltips = defaultSettings.disableTooltips;
									truncateTabTitle = defaultSettings.truncateTabTitle;
									optionsStore.updateOptions(defaultSettings);
								}}
							>
								<Reset size="16" class="mr-2" />
								Reset
							</Button>
						{/snippet}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<Button
			onclick={async () => {
				optionsStore.updateOptions({
					windowMaxHeight,
					showTabUrl,
					sortByUrl,
					sortDescending,
					disableTooltips,
					truncateTabTitle
				});
				toast.success('Settings saved');
			}}>Save</Button
		>
	</Card.Footer>
</Card.Root>
