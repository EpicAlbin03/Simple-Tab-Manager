<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import GithubLogo from 'svelte-radix/GithubLogo.svelte';
	import Star from 'svelte-radix/Star.svelte';
	import FormField from '$lib/components/options/FormField.svelte';
	import { getExtensionVersion } from '$lib/chrome/utils';
	import Kofi from '$lib/images/kofi.webp';
	import { Separator } from '$lib/components/ui/separator/index.js';
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

			<Separator orientation="horizontal" class="my-2" />
			<legend class="text-base font-medium">Support</legend>
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
			<FormField desc="Rate the extension on Chrome Web Store">
				<Button
					href="https://chromewebstore.google.com/detail/simple-tab-manager/mdfbfcbfcohpbdicnpdpcdioggfdddlc/reviews"
					target="_blank"
					variant="outline"
					size="icon"
				>
					<Star size="16" />
				</Button>
			</FormField>
		</div>
	</Card.Content>
</Card.Root>
