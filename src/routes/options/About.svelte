<script lang="ts">
	import { createTab } from '$lib/chrome/tabs';
	import { beforeUpdate } from 'svelte';
	// @ts-ignore
	import LogoGithub from 'svelte-ionicons/LogoGithub.svelte';

	let extensionVersion = '';

	async function getExtensionVersion() {
		const manifest = await chrome.runtime.getManifest();
		return manifest.version;
	}

	beforeUpdate(async () => {
		extensionVersion = await getExtensionVersion();
	});
</script>

<ul class="flex flex-col gap-2">
	<h2 class="card-title text-sm">Extension</h2>
	<li class="grid grid-cols-5 items-center">
		<div class="col-span-3 pr-2">
			<p class="text-xs">Version</p>
		</div>
		<div class="col-span-2 place-self-end text-xs">
			<p>v{extensionVersion}</p>
		</div>
	</li>
	<li class="grid grid-cols-5 items-center">
		<div class="col-span-3 pr-2">
			<p class="text-xs">Github</p>
		</div>
		<div class="col-span-2 place-self-end text-xs">
			<button
				class="btn btn-square btn-neutral btn-xs bottomTippy"
				on:click={async () =>
					await createTab({
						url: 'https://github.com/EpicAlbin03/Simple-Tab-Manager.git'
					})}
				data-tippy-content="Github"
			>
				<LogoGithub size="16" />
			</button>
		</div>
	</li>
</ul>
