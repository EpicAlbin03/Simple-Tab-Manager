<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ArrowLeft from 'svelte-radix/ArrowLeft.svelte';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import About from '$lib/components/options/About.svelte';
	import Settings from '$lib/components/options/Settings.svelte';
	import Shortcuts from '$lib/components/options/Shortcuts.svelte';
</script>

<div class="flex h-full w-full justify-center border p-12">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					href="/"
					variant="ghost"
					size="icon"
					class="absolute left-12"
					onclick={() => toast.dismiss()}
				>
					<ArrowLeft size="16" />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom">
			<p>Go Back</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tabs.Root value="settings" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
			<Tabs.Trigger value="shortcuts">Shortcuts</Tabs.Trigger>
			<Tabs.Trigger value="about">About</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="settings" class="scrollable max-h-[440px] overflow-y-auto">
			<Settings />
		</Tabs.Content>

		<Tabs.Content value="shortcuts" class="scrollable max-h-[440px] overflow-y-auto">
			<Shortcuts />
		</Tabs.Content>

		<Tabs.Content value="about" class="scrollable max-h-[440px] overflow-y-auto">
			<About />
		</Tabs.Content>
	</Tabs.Root>
</div>
