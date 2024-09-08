<script lang="ts">
	import Grid from 'svelte-radix/Grid.svelte';
	import ListBullet from 'svelte-radix/ListBullet.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import Plus from 'svelte-radix/Plus.svelte';
	import Bookmark from 'svelte-radix/Bookmark.svelte';
	import SpeakerOff from 'svelte-radix/SpeakerOff.svelte';
	import DrawingPin from 'svelte-radix/DrawingPin.svelte';
	import Search from '$lib/components/popup/Search.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';
	import { setOptions, type Options } from '$lib/chrome/storage';
	import { createEmptyWindow } from '$lib/chrome/windows';

	const options: Options = getContext('options');
	let tabView = $state(options.tabView);
</script>

<div class="flex items-center justify-between border-t bg-background p-1">
	<Search />

	<div class="flex gap-1">
		<Button variant="ghost" size="icon" onclick={async () => await createEmptyWindow()}>
			<Plus size="16" />
		</Button>

		<Button variant="ghost" size="icon">
			<Bookmark size="16" />
		</Button>

		<Button variant="ghost" size="icon">
			<SpeakerOff size="16" />
		</Button>

		<Button variant="ghost" size="icon">
			<DrawingPin size="16" />
		</Button>

		<Button variant="ghost" size="icon">
			<Trash size="16" />
		</Button>

		<Button
			variant="ghost"
			size="icon"
			onclick={async () => {
				tabView = tabView === 'list' ? 'grid' : 'list';
				await setOptions({ tabView });
			}}
		>
			{#if tabView === 'list'}
				<ListBullet size="16" />
			{:else}
				<Grid size="16" />
			{/if}
		</Button>
	</div>
</div>
