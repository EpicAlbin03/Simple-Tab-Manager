<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import FormField from '$lib/components/options/FormField.svelte';
	import Kbd from '$lib/components/options/Kbd.svelte';
</script>

<Card.Root>
	<Card.Content class="mt-4 space-y-2">
		<div class="flex flex-col gap-4">
			<legend class="text-base font-medium">Window</legend>
			<FormField desc="Select tab">
				<Kbd>CLICK</Kbd>
			</FormField>
			<FormField desc="Select multiple tabs">
				<Kbd>SHIFT + CLICK</Kbd>
			</FormField>
			<FormField desc="Open tab">
				<Kbd><span class="text-xs">⌘</span>+ CLICK</Kbd>
			</FormField>

			<Separator orientation="horizontal" class="my-2" />
			<legend class="text-base font-medium">Bottom Navigation</legend>
			<FormField desc="Focus search bar">
				<Kbd><span class="text-xs">⌘</span>+ K</Kbd>
			</FormField>
			<FormField desc="Open new window">
				<Kbd><span class="text-xs">⌘</span>+ N</Kbd>
			</FormField>
			<FormField desc="Open bookmark manager">
				<Kbd><span class="text-xs">⌘</span>+ B</Kbd>
			</FormField>
			<FormField desc="Mute selected tabs">
				<Kbd><span class="text-xs">⌘</span>+ SHIFT + M</Kbd>
			</FormField>
			<FormField desc="Pin selected tabs">
				<Kbd><span class="text-xs">⌘</span>+ SHIFT + P</Kbd>
			</FormField>
			<FormField desc="Close selected tabs">
				<Kbd><span class="text-xs">⌘</span>+ SHIFT + DEL</Kbd>
			</FormField>

			<Separator orientation="horizontal" class="my-2" />
			<legend class="text-base font-medium">Top Navigation</legend>
			<FormField desc="Export windows">
				<Kbd><span class="text-xs">⌘</span>+ SHIFT + S</Kbd>
			</FormField>
		</div>
	</Card.Content>
</Card.Root>
