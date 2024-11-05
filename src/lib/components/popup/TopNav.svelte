<script lang="ts">
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import Upload from 'svelte-radix/Upload.svelte';
	import Download from 'svelte-radix/Download.svelte';
	import QuestionMarkCircled from 'svelte-radix/QuestionMarkCircled.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { setTheme } from '$lib/theme';
	import { getContext } from 'svelte';
	import { windowsStore, type OptionsStore } from '$lib/stores.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn } from '$lib/utils';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { toast } from 'svelte-sonner';
	import { setSessionStorageItem } from '$lib/chrome/storage';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { TabInfoSchema, WindowInfoArraySchema, type WindowInfo } from '$lib/schemas';
	import { onExport } from '$lib/shortcuts';

	const optionsStore: OptionsStore = getContext('optionsStore');
	let theme = $state(optionsStore.options.theme);

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

	$effect(() => {
		document.addEventListener('keydown', (event: KeyboardEvent) => onExport(event, exportWindows));

		return () => {
			document.removeEventListener('keydown', (event: KeyboardEvent) =>
				onExport(event, exportWindows)
			);
		};
	});

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

	export function extractWindowInfo(windows: ChromeWindow[]) {
		const windowsInfo: WindowInfo[] = [];

		for (let i = 0; i < windows.length; i++) {
			const currentWindow = windows[i];
			const windowInfo: WindowInfo = {
				name: currentWindow.name || `Window ${i + 1}`,
				color: currentWindow.color || 'default',
				tabs: []
			};

			if (currentWindow.tabs && Array.isArray(currentWindow.tabs)) {
				windowInfo.tabs = currentWindow.tabs
					.map((tab) => ({
						url: tab.url,
						pinned: tab.pinned || false,
						muted: tab.mutedInfo?.muted || false
					}))
					.filter((tab) => {
						const result = TabInfoSchema.safeParse(tab);
						return result.success;
					});
			}

			windowsInfo.push(windowInfo);
		}

		return windowsInfo;
	}

	export function exportWindows() {
		const windows = extractWindowInfo(windowsStore.windows);
		const json = JSON.stringify(windows);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'stm-windows.json';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="flex items-center justify-between border-b bg-background p-1">
	<div class="flex gap-1">
		<Dialog.Root bind:open={importDialogOpen}>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon">
								<Upload size="16" />
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p class="font-normal">Import</p>
					</Tooltip.Content>
				</Tooltip.Root>
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
										<QuestionMarkCircled size="16" />
									</div>
								{/snippet}
							</HoverCard.Trigger>
							<HoverCard.Content align="start" class="w-fit">
								<pre>{JSON.stringify(WindowInfoType, null, 2)}</pre>
							</HoverCard.Content>
						</HoverCard.Root>
						<Input
							disabled={textAreaContent.length > 0}
							id="json"
							type="file"
							accept=".json"
							onchange={handleFileChange}
						/>
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
					<Button
						disabled={!fileContent && textAreaContent.length === 0}
						onclick={async () => {
							if (fileContent) {
								for (const window of fileContent) {
									const urls = window.tabs.map((tab) => tab.url);
									const newWindow = await chrome.windows.create({ url: urls });
									await windowsStore.addWindow({
										name: window.name,
										color: window.color,
										...newWindow
									});
									await setSessionStorageItem(
										`window-${newWindow.id}`,
										JSON.stringify({ name: window.name, color: window.color })
									);
									await windowsStore.refreshWindows();

									for (const [i, tab] of window.tabs.entries()) {
										if (tab.pinned) {
											await chrome.tabs.update(newWindow.tabs![i].id!, { pinned: true });
										}
										if (tab.muted) {
											await chrome.tabs.update(newWindow.tabs![i].id!, { muted: true });
										}
									}
								}
							} else if (textAreaContent.length > 0) {
								const newWindowUrls = splitUrlsToArr(textAreaContent);
								for (const urls of newWindowUrls) {
									await chrome.windows.create({ url: urls });
								}
								await windowsStore.refreshWindows();
							}

							importDialogOpen = false;
							fileContent = undefined;
							textAreaContent = '';
							toast.success('Imported windows successfully');
						}}
					>
						Import
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" onclick={() => exportWindows()}>
						<Download size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Export</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>

	<div class="ml-auto flex gap-1">
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" href="/options">
						<Gear size="16" />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Options</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						onclick={async () => {
							theme = theme === 'light' ? 'dark' : 'light';
							setTheme(theme);
							optionsStore.updateOptions({ theme });
						}}
					>
						{#if theme === 'light'}
							<Sun size="16" />
						{:else}
							<Moon size="16" />
						{/if}
						<span class="sr-only">Toggle theme</span>
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if theme === 'light'}
					<p>Dark theme</p>
				{:else}
					<p>Light theme</p>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
