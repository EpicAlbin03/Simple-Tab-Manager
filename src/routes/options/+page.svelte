<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import About from '$lib/components/options/About.svelte';
	import Settings from '$lib/components/options/Settings.svelte';
	import Shortcuts from '$lib/components/options/Shortcuts.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { iconProps } from '$lib/utils';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
</script>

<div class="flex h-full w-full justify-center border p-8">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					href="/"
					variant="ghost"
					size="icon"
					class="absolute left-8"
					onclick={() => toast.dismiss()}
				>
					<ArrowLeft {...iconProps} />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom">
			<p>Go Back</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tabs.Root value="settings" class="w-full max-w-sm">
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
			<Tabs.Trigger value="shortcuts">Shortcuts</Tabs.Trigger>
			<Tabs.Trigger value="about">About</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="settings">
			<ScrollArea class="h-[492px] w-full">
				<Settings />
			</ScrollArea>
		</Tabs.Content>
		<Tabs.Content value="shortcuts">
			<ScrollArea class="h-[492px] w-full">
				<Shortcuts />
			</ScrollArea>
		</Tabs.Content>
		<Tabs.Content value="about">
			<ScrollArea class="h-[492px] w-full">
				<About />
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>
</div>
