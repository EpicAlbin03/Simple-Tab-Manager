<script lang="ts">
	// @ts-ignore
	import MoonOutline from 'svelte-ionicons/MoonOutline.svelte';
	// @ts-ignore
	import SettingsOutline from 'svelte-ionicons/SettingsOutline.svelte';
	// @ts-ignore
	import StarOutline from 'svelte-ionicons/StarOutline.svelte';
	// @ts-ignore
	import SunnyOutline from 'svelte-ionicons/SunnyOutline.svelte';
	// @ts-ignore
	import LogoGithub from 'svelte-ionicons/LogoGithub.svelte';
	import LogoKoFi from '$lib/images/kofi-logo.png';
	import { beforeUpdate } from 'svelte';
	import { createTab } from '$lib/chrome/tabs';

	let darkMode = false;

	beforeUpdate(async () => {
		const data = await chrome.storage.sync.get('darkMode');
		darkMode = data.darkMode ?? darkMode;
		setDarkMode();
	});

	async function toggleTheme() {
		await chrome.storage.sync.set({ darkMode: darkMode });
		setDarkMode();
	}

	function setDarkMode() {
		const newTheme = darkMode ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', newTheme);
	}
</script>

<ul class="h-10 bg-base-300 flex flex-row-reverse gap-2 items-center p-2">
	<li class="flex items-center">
		<button
			class=" btn btn-square btn-outline btn-sm bottomTippy"
			data-tippy-content={darkMode ? 'Light Mode' : 'Dark Mode'}
		>
			<label class="swap swap-rotate w-full h-full">
				<input
					type="checkbox"
					bind:checked={darkMode}
					on:change={async () => await toggleTheme()}
				/>
				<SunnyOutline size="16" class="swap-on" />
				<MoonOutline size="16" class="swap-off" />
			</label>
		</button>
	</li>
	<li>
		<a
			role="button"
			href="/options"
			class="btn btn-square btn-neutral btn-sm bottomTippy"
			data-tippy-content="Options"
			tabindex="0"
		>
			<SettingsOutline size="16" />
		</a>
	</li>
	<li>
		<button
			class="btn btn-square btn-neutral btn-sm bottomTippy"
			on:click={async () =>
				await createTab({
					url: 'https://github.com/EpicAlbin03/Simple-Tab-Manager.git'
				})}
			data-tippy-content="Github"
		>
			<LogoGithub size="16" />
		</button>
	</li>
	<li>
		<button
			class="btn btn-square btn-warning btn-sm bottomTippy"
			data-tippy-content="Rate us!"
			on:click={async () =>
				await createTab({
					url: 'https://chrome.google.com/webstore/detail/simple-tab-manager/mdfbfcbfcohpbdicnpdpcdioggfdddlc/'
				})}
		>
			<StarOutline size="16" />
		</button>
	</li>
	<li>
		<button
			class="btn btn-square btn-accent btn-sm bottomTippy"
			data-tippy-content="Buy me a coffe!"
			on:click={async () =>
				await createTab({
					url: 'https://ko-fi.com/albincarlsson'
				})}
		>
			<img class="h-3.5" src={LogoKoFi} alt="Ko-fi Logo" />
		</button>
	</li>
</ul>
