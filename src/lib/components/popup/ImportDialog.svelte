<script lang="ts" module>
	import { z } from 'zod';

	const formSchema = z.object({
		jsonFile: z.instanceof(File).optional(),
		urls: z.string().default(''),
		closeCurrentWindows: z.boolean().default(false)
	});

	type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { iconProps } from '$lib/utils';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { WindowInfoArraySchema, type WindowInfo } from '$lib/schemas';
	import { CircleQuestionMark, Upload } from '@lucide/svelte';
	import { setSessionStorageItem } from '$lib/chrome/storage';
	import * as Form from '$lib/components/ui/form';
	import { defaults, superForm, type Infer, fileProxy } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { removeWindow } from '$lib/chrome/windows';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

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

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		SPA: true,
		resetForm: true,
		onSubmit: () => {
			if (!$formData.jsonFile && $formData.urls.trim().length === 0) {
				toast.error('Please provide either a JSON file or URLs');
				return;
			}
		},
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				await onImport(f.data as Infer<FormSchema>);
			}
		}
	});

	const { form: formData, enhance } = form;
	const file = fileProxy(form, 'jsonFile');

	function parseJsonFile(file: File): Promise<WindowInfo[]> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = function (e: ProgressEvent<FileReader>): void {
				if (e.target?.result) {
					try {
						const parsedContent = JSON.parse(e.target.result as string);
						const validationResult = WindowInfoArraySchema.safeParse(parsedContent);

						if (validationResult.success) {
							resolve(validationResult.data);
						} else {
							reject(new Error('Invalid JSON format'));
						}
					} catch (error) {
						reject(new Error('Error parsing JSON'));
					}
				}
			};

			reader.onerror = () => reject(new Error('Error reading file'));
			reader.readAsText(file);
		});
	}

	function splitUrlsToArr(input: string): string[][] {
		const lines = input.split('\n');

		let result: string[][] = [];
		let group: string[] = [];

		for (const line of lines) {
			if (line.trim() !== '') {
				group.push(line.trim());
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

	async function onImport(data: Infer<FormSchema>) {
		try {
			// Validate that either file or URLs are provided
			if (!data.jsonFile && (!data.urls || data.urls.trim().length === 0)) {
				toast.error('Please provide either a JSON file or URLs');
				return;
			}

			// Close current windows if requested
			if (data.closeCurrentWindows) {
				const currentWindows = await chrome.windows.getAll();
				for (const window of currentWindows) {
					if (window.id) {
						await removeWindow(window.id);
					}
				}
			}

			// Import from JSON file
			if (data.jsonFile) {
				const windowsData = await parseJsonFile(data.jsonFile);
				for (const window of windowsData) {
					const urls = window.tabs.map((tab) => tab.url);
					const newWindow = await chrome.windows.create({ url: urls });
					if (!newWindow || !newWindow.id) {
						toast.error('Failed to create window');
						return;
					}
					await setSessionStorageItem(
						`window-${newWindow.id}`,
						JSON.stringify({ name: window.name, color: window.color })
					);

					for (const [i, tab] of window.tabs.entries()) {
						if (newWindow.tabs?.[i]?.id) {
							if (tab.pinned) {
								await chrome.tabs.update(newWindow.tabs[i].id!, { pinned: true });
							}
							if (tab.muted) {
								await chrome.tabs.update(newWindow.tabs[i].id!, { muted: true });
							}
						}
					}
				}
			}
			// Import from URLs
			else if (data.urls && data.urls.trim().length > 0) {
				const newWindowUrls = splitUrlsToArr(data.urls);
				for (const urls of newWindowUrls) {
					await chrome.windows.create({ url: urls });
				}
			}

			importDialogOpen = false;
			toast.success('Imported windows successfully');
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to import windows');
		}
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
	<Dialog.Content
		class="sm:max-w-[425px]"
		interactOutsideBehavior="ignore"
		onInteractOutside={(e) => {
			e.preventDefault();
		}}
		onFocusOutside={(e) => {
			e.preventDefault();
		}}
	>
		<Dialog.Header>
			<Dialog.Title>Import</Dialog.Title>
			<Dialog.Description>
				Import windows and tabs from a formatted JSON file or a list of URLs.
			</Dialog.Description>
		</Dialog.Header>

		<form
			id="import-form"
			method="POST"
			enctype="multipart/form-data"
			use:enhance
			class="grid gap-8 py-4"
		>
			<div class="grid w-full max-w-sm items-center gap-1">
				<HoverCard.Root>
					<HoverCard.Trigger>
						{#snippet child({ props: hoverProps })}
							<div {...hoverProps} class="flex w-fit items-center gap-1">
								<Label for="json-file">JSON File</Label>
								<CircleQuestionMark {...iconProps} />
							</div>
						{/snippet}
					</HoverCard.Trigger>
					<HoverCard.Content align="start" class="w-fit">
						<pre>{JSON.stringify(WindowInfoType, null, 2)}</pre>
					</HoverCard.Content>
				</HoverCard.Root>
				<Input
					id="json-file"
					name="jsonFile"
					type="file"
					accept=".json"
					disabled={$formData.urls.trim().length > 0}
					bind:files={$file}
				/>
			</div>

			<Form.Field {form} name="urls">
				<Form.Control>
					{#snippet children({ props })}
						<div class="grid w-full gap-1.5">
							<Form.Label>List of URLs</Form.Label>
							<Textarea
								{...props}
								disabled={$formData.jsonFile !== undefined}
								placeholder="https://www.example.com
https://www.example.com

https://www.example.com"
								class="h-32"
								bind:value={$formData.urls}
							/>
							<Form.Description>Separate windows with blank lines.</Form.Description>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="closeCurrentWindows" class="flex items-center gap-3">
				<Form.Control>
					{#snippet children({ props })}
						<Checkbox {...props} bind:checked={$formData.closeCurrentWindows} class="mb-0" />
						<Form.Label
							class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Close currently open windows
						</Form.Label>
					{/snippet}
				</Form.Control>
			</Form.Field>
		</form>

		<Dialog.Footer>
			<Button
				type="submit"
				form="import-form"
				disabled={!$formData.jsonFile && $formData.urls.trim().length === 0}
			>
				Import
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
