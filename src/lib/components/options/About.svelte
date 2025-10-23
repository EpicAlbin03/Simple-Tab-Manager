<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { getExtensionVersion } from '$lib/chrome/utils';
	import { Github, Star } from '@lucide/svelte';
	import { iconProps } from '$lib/utils';
</script>

<Card.Root>
	<Card.Content class="space-y-2">
		<div class="flex flex-col gap-4">
			<Field.Legend class="mb-0">Extension</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Version</Field.Label>
				{#await getExtensionVersion() then version}
					<span class="text-xs">{version}</span>
				{/await}
			</Field.Field>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">Github</Field.Label>
				<Button
					href="https://github.com/EpicAlbin03/Simple-Tab-Manager"
					target="_blank"
					variant="outline"
					size="icon"
				>
					<Github {...iconProps} />
				</Button>
			</Field.Field>

			<Field.Separator class="my-2" />

			<Field.Legend class="mb-0">Support</Field.Legend>
			<Field.Field orientation="horizontal" class="justify-between">
				<Field.Label class="text-sm text-muted-foreground">
					Rate us on the Chrome Web Store
				</Field.Label>
				<Button
					href="https://chromewebstore.google.com/detail/simple-tab-manager/mdfbfcbfcohpbdicnpdpcdioggfdddlc/reviews"
					target="_blank"
					variant="outline"
					size="icon"
				>
					<Star {...iconProps} />
				</Button>
			</Field.Field>
		</div>
	</Card.Content>
</Card.Root>
