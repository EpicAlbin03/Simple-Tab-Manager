<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Kbd from '$lib/components/ui/kbd/index.js';
</script>

<Card.Root>
	<Card.Content class="space-y-2">
		<div class="flex flex-col gap-4">
			<Field.Legend class="mb-0">Window</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Select tab</Field.Label>
				<Kbd.Root>CLICK</Kbd.Root>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Select multiple tabs</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⇧</Kbd.Root>
					<span>+</span>
					<Kbd.Root>CLICK</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Open tab</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>CLICK</Kbd.Root>
				</Kbd.Group>
			</Field.Field>

			<Field.Separator class="my-2" />

			<Field.Legend class="mb-0">Top Navigation</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Export windows</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>⇧</Kbd.Root>
					<span>+</span>
					<Kbd.Root>S</Kbd.Root>
				</Kbd.Group>
			</Field.Field>

			<Field.Separator class="my-2" />

			<Field.Legend class="mb-0">Bottom Navigation</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Focus search bar</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>K</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Open new window</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>N</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Open bookmark manager</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>B</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Mute selected tabs</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>⇧</Kbd.Root>
					<span>+</span>
					<Kbd.Root>M</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Pin selected tabs</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>⇧</Kbd.Root>
					<span>+</span>
					<Kbd.Root>P</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Close selected tabs</Field.Label>
				<Kbd.Group>
					<Kbd.Root>⌘</Kbd.Root>
					<span>+</span>
					<Kbd.Root>⇧</Kbd.Root>
					<span>+</span>
					<Kbd.Root>⌫</Kbd.Root>
				</Kbd.Group>
			</Field.Field>
		</div>
	</Card.Content>
</Card.Root>
