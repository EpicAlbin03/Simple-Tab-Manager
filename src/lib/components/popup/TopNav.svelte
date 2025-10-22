<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { iconProps } from '$lib/utils';
	import { TabInfoSchema, type WindowInfo } from '$lib/schemas';
	import { OptionStoreContext, type OptionStore } from '$lib/stores/option-store.svelte';
	import { Download, Moon, RotateCw, Settings, Sun, Upload } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import ImportDialog from './ImportDialog.svelte';
	import { WindowStore, WindowStoreContext } from '$lib/stores/window-store.svelte';
	import { shortcut } from '$lib/actions/shortcut.svelte';
	import { dummyWindows } from '$lib/dummydata';
	import { createWindow, removeWindow } from '$lib/chrome/windows';
	import { PUBLIC_DEV } from '$env/static/public';
	import { createTab } from '$lib/chrome/tabs';

	const windowStore: WindowStore = WindowStoreContext.get();
	const optionStore: OptionStore = OptionStoreContext.get();
	const options = $derived(optionStore.options);
	const windows = $derived(windowStore.windows);

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
		const extractedWindows = extractWindowInfo(windows);
		const json = JSON.stringify(extractedWindows);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'stm-windows.json';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:window use:shortcut={{ key: 's', ctrl: true, shift: true, callback: exportWindows }} />

<div class="flex items-center justify-between border-b bg-background p-2">
	<div class="flex gap-1">
		<ImportDialog />

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" onclick={exportWindows}>
						<Download {...iconProps} />
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Export</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>

	{#if PUBLIC_DEV}
		<div class="flex gap-1">
			<Button variant="ghost" size="icon" onclick={async () => await windowStore.loadWindows()}>
				<RotateCw {...iconProps} />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onclick={async () => {
					const windows = dummyWindows.slice(0, 2);
					windows.forEach(async (window) => {
						await createWindow(window.tabs.map((tab) => tab.url));
					});
					await createTab('chrome://extensions');
				}}
			>
				<Upload {...iconProps} />
			</Button>
		</div>
	{/if}

	<div class="flex gap-1">
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="icon" href="/options">
						<Settings {...iconProps} />
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
							toggleMode();
							await optionStore.updateOptions({
								theme: options.theme === 'light' ? 'dark' : 'light'
							});
						}}
					>
						<Sun
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
							{...iconProps}
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
							{...iconProps}
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if options.theme === 'light'}
					<p>Dark Theme</p>
				{:else}
					<p>Light Theme</p>
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
