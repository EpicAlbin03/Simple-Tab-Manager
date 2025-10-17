<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn, iconProps } from '$lib/utils';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { WindowInfoArraySchema, type WindowInfo } from '$lib/schemas';
	import { CircleQuestionMark, Upload } from '@lucide/svelte';

	const WindowInfoType = {
		name: 'string | undefined',
		color: 'string | undefined',
		tabs: [
			{
				url: 'string',
				pinned: 'boolean | undefined',
				muted: 'boolean | undefined'
			}
		]
	};

	let importDialogOpen = $state(false);
	let fileContent: WindowInfo[] | undefined = $state();
	let textAreaContent: string = $state('');

	function handleFileChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = function (e: ProgressEvent<FileReader>): void {
				if (e.target?.result) {
					try {
						const parsedContent = JSON.parse(e.target.result as string);

						const validationResult = WindowInfoArraySchema.safeParse(parsedContent);

						if (validationResult.success) {
							fileContent = validationResult.data;
						} else {
							toast.error('Invalid JSON format');
						}
					} catch (error) {
						toast.error('Error parsing JSON');
					}
				}
			};

			reader.readAsText(file);
		} else {
			fileContent = undefined;
		}
	}

	function splitUrlsToArr(input: string): string[][] {
		const lines = input.split('\n');

		let result: string[][] = [];
		let group: string[] = [];

		for (const line of lines) {
			if (line.trim() !== '') {
				group.push(line);
			} else if (group.length > 0) {
				result.push(group);
				group = [];
			}
		}

		if (group.length > 0) {
			result.push(group);
		}

		return result;
	}
</script>

<Dialog.Root bind:open={importDialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger {...props}>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon">
							<Upload {...iconProps} />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p class="font-normal">Import</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Import</Dialog.Title>
			<Dialog.Description>
				Import windows and tabs from a formatted JSON file or a list of URLs.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-8 py-4">
			<div class="grid w-full max-w-sm items-center gap-1">
				<HoverCard.Root>
					<HoverCard.Trigger>
						{#snippet child({ props })}
							<div {...props} class="flex w-fit items-center gap-1">
								<Label for="json">JSON File</Label>
								<CircleQuestionMark {...iconProps} />
							</div>
						{/snippet}
					</HoverCard.Trigger>
					<HoverCard.Content align="start" class="w-fit">
						<pre>{JSON.stringify(WindowInfoType, null, 2)}</pre>
					</HoverCard.Content>
				</HoverCard.Root>
				<Input disabled={textAreaContent.length > 0} id="json" type="file" accept=".json" />
			</div>

			<div class="grid w-full gap-1.5">
				<Label for="urls">List of URLs</Label>
				<Textarea
					disabled={fileContent !== undefined}
					placeholder="https://www.google.com
https://www.youtube.com

https://www.example.com"
					class="h-32"
					id="urls"
					bind:value={textAreaContent}
				/>
				<p class="text-sm text-muted-foreground">Separate windows with blank lines.</p>
			</div>
		</div>

		<Dialog.Footer>
			<Button disabled={!fileContent && textAreaContent.length === 0}>Import</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
