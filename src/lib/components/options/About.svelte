<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import GithubLogo from 'svelte-radix/GithubLogo.svelte';
	import FormField from '$lib/components/options/FormField.svelte';
	import { getExtensionVersion } from '$lib/chrome/utils';
	import Kofi from '$lib/images/kofi.webp';
</script>

<Card.Root>
	<Card.Content class="mt-4 space-y-2">
		<div class="flex flex-col gap-4">
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
			<FormField desc="Support me on Ko-fi">
				<Button
					href="https://ko-fi.com/albincarlsson"
					target="_blank"
					variant="outline"
					size="icon"
				>
					<img src={Kofi} alt="Support me on Ko-fi" height="16" class="h-4" />
				</Button>
			</FormField>
		</div>
	</Card.Content>
</Card.Root>
