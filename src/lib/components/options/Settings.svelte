<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { toast } from 'svelte-sonner';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { RotateCcw } from '@lucide/svelte';
	import { iconProps } from '$lib/utils';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);

	let windowMaxHeight = $derived(options.windowMaxHeight);
	let showTabUrl = $derived(options.showTabUrl);
	let sortByUrl = $derived(options.sortByUrl);
	let sortDescending = $derived(options.sortDescending);
	let disableTooltips = $derived(options.disableTooltips);
	let truncateTabTitle = $derived(options.truncateTabTitle);

	let alertDialogOpen = $state(false);
</script>

<Card.Root class="px-6">
	<Card.Content class="space-y-2 px-0">
		<div class="flex flex-col gap-4">
			<Field.Legend class="mb-0">Window</Field.Legend>
			<Field.Field>
				<div class="flex justify-between">
					<Field.Label class="text-sm text-muted-foreground">
						Max window height before showing scrollbar (px)
					</Field.Label>
					<NumberInput bind:value={windowMaxHeight} class="w-56" />
				</div>
				<Field.Description class="ml-auto">0 = infinite height / no scrollbar</Field.Description>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">
					Show tab url instead of title
				</Field.Label>
				<Switch bind:checked={showTabUrl} />
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Truncate tab title/url</Field.Label>
				<Switch bind:checked={truncateTabTitle} />
			</Field.Field>

			<Field.Separator class="my-2" />

			<Field.Legend class="mb-0">Sorting</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">
					Sort by url instead of title
				</Field.Label>
				<Switch bind:checked={sortByUrl} />
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Sort by descending order</Field.Label>
				<Switch bind:checked={sortDescending} />
			</Field.Field>

			<Field.Separator class="my-2" />

			<Field.Legend class="mb-0">Tooltips</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Disable tooltips</Field.Label>
				<Switch bind:checked={disableTooltips} />
			</Field.Field>
		</div>
	</Card.Content>

	<Field.Separator class="my-2" />

	<Card.Footer class="flex justify-between px-0">
		<AlertDialog.Root bind:open={alertDialogOpen}>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="destructive">
						<RotateCcw {...iconProps} />
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
								class="text-primary-foreground dark:text-foreground"
								onclick={async () => {
									await optionStore.resetOptions();
									alertDialogOpen = false;
								}}
							>
								<RotateCcw {...iconProps} />
								Reset
							</Button>
						{/snippet}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<Button
			onclick={async () => {
				await optionStore.updateOptions({
					windowMaxHeight,
					showTabUrl,
					sortByUrl,
					sortDescending,
					disableTooltips,
					truncateTabTitle
				});
				toast.success('Settings saved');
			}}
		>
			Save
		</Button>
	</Card.Footer>
</Card.Root>
