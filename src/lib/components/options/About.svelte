<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import GithubLogo from 'svelte-radix/GithubLogo.svelte';
	import FormField from '$lib/components/options/FormField.svelte';
	import { getExtensionVersion } from '$lib/chrome/utils';
</script>

<Card.Root>
	<Card.Content class="mt-4 space-y-2">
		<div class="flex flex-col gap-4">
			<legend class="text-base font-medium">Extension</legend>
			<FormField desc="Version">
				{#await getExtensionVersion() then version}
					<span class="text-xs">{version}</span>
				{/await}
			</FormField>
			<FormField desc="Github">
				<Button href="/" variant="outline" size="icon">
					<GithubLogo size="16" />
				</Button>
			</FormField>
		</div>
	</Card.Content>
</Card.Root>
