<script lang="ts">
	import { handleTooltips } from '$lib/tooltips';
	import { afterUpdate } from 'svelte';
	// @ts-ignore
	import ArrowBackOutline from 'svelte-ionicons/ArrowBackOutline.svelte';
	import Settings from './Settings.svelte';
	import Keybinds from './Keybinds.svelte';
	import About from './About.svelte';

	let activeTab = 'Settings';

	function toggleActiveTab(e: MouseEvent) {
		if (e.target instanceof HTMLButtonElement) {
			e.target.classList.add('tab-active');
			activeTab = e.target.textContent?.toString() ?? '';
			const tabs = document.querySelectorAll('.tab');
			for (const tab of tabs) {
				if (tab !== e.target) {
					tab.classList.remove('tab-active');
				}
			}
		}
	}

	afterUpdate(async () => {
		await handleTooltips();
	});
</script>

<div class="flex justify-center items-center h-full bg-base-200">
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body gap-8">
			<div class="flex justify-center items-center">
				<a
					role="button"
					href="/"
					tabindex="0"
					class="btn btn-xs btn-circle w-fit h-fit min-h-0 bg-transparent border-transparent absolute left-8 bottomTippy"
					data-tippy-content="Go back"
				>
					<ArrowBackOutline size="16" />
				</a>
				<div class="tabs w-fit">
					<button class="tab tab-sm tab-lifted tab-active" on:click={(e) => toggleActiveTab(e)}>
						Settings
					</button>
					<button class="tab tab-sm tab-lifted" on:click={(e) => toggleActiveTab(e)}>
						Keybinds
					</button>
					<button class="tab tab-sm tab-lifted" on:click={(e) => toggleActiveTab(e)}>
						About
					</button>
				</div>
			</div>
			{#if activeTab === 'Settings'}
				<Settings />
			{:else if activeTab === 'Keybinds'}
				<Keybinds />
			{:else if activeTab === 'About'}
				<About />
			{/if}
		</div>
	</div>
</div>
