<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { createTab, titleSort, urlSort } from '$lib/chrome/tabs';
	// @ts-ignore
	import CreateOutline from 'svelte-ionicons/CreateOutline.svelte';
	// @ts-ignore
	import CloseOutline from 'svelte-ionicons/CloseOutline.svelte';
	// @ts-ignore
	import AddOutline from 'svelte-ionicons/AddOutline.svelte';
	// @ts-ignore
	import ChevronDownOutline from 'svelte-ionicons/ChevronDownOutline.svelte';
	// @ts-ignore
	import ChevronUpOutline from 'svelte-ionicons/ChevronUpOutline.svelte';
	// @ts-ignore
	import BanOutline from 'svelte-ionicons/BanOutline.svelte';
	// @ts-ignore
	import SwapVerticalOutline from 'svelte-ionicons/SwapVerticalOutline.svelte';
	import { toggleMinimizedWindow, removeWindow } from '$lib/chrome/windows';
	import colors from '$lib/colors';

	export let window: chrome.windows.Window;
	export let i: number;
	export let minimized: boolean;
	export let windowColor = '';
	let modalDialog: HTMLDialogElement;
	let windowName = `Window ${i + 1}`;
	let nameInput: HTMLInputElement;

	function saveWindowName(name: string) {
		windowName = name;
		chrome.storage.local.set({ [`windowName${i}`]: name });
	}

	function saveWindowColor(color: string) {
		windowColor = color;
		chrome.storage.local.set({ [`windowColor${i}`]: color });
	}

	async function quicksort() {
		const { sortByUrl } = await chrome.storage.sync.get('sortByUrl');
		if (sortByUrl) {
			urlSort(window);
		} else {
			titleSort(window);
		}
	}

	beforeUpdate(async () => {
		const nameData = await chrome.storage.local.get(`windowName${i}`);
		const colorData = await chrome.storage.local.get(`windowColor${i}`);
		windowName = nameData[`windowName${i}`] ?? windowName;
		windowColor = colorData[`windowColor${i}`] ?? windowColor;
	});
</script>

<div class="flex items-center relative">
	<div class="menu-title max-w-[11rem] truncate">{windowName}</div>
	<div class="flex gap-2">
		<button
			class="btn btn-xs btn-circle w-fit h-fit min-h-0 bg-transparent border-transparent bottomTippy"
			data-tippy-content="Customize"
			on:click={() => modalDialog.showModal()}
		>
			<CreateOutline size="16" />
		</button>
		<dialog class="modal" bind:this={modalDialog}>
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-xs btn-circle btn-ghost absolute right-4 top-4">
						<CloseOutline size="20" />
					</button>
				</form>
				<div class="flex flex-col gap-4">
					<h3 class="font-bold text-md text-center">Customize window</h3>
					<input
						type="text"
						placeholder="Name.."
						class="input input-bordered input-sm w-fit max-w-xs mx-auto"
						value={windowName}
						bind:this={nameInput}
						on:change={() => saveWindowName(nameInput.value)}
					/>
					<div class="overflow-y-scroll h-48 w-fit mx-auto">
						<div class="flex">
							<button class="btn btn-square btn-xs bg-white" on:click={() => saveWindowColor('')}>
								<BanOutline size="16" />
							</button>
							<button
								class="btn btn-square btn-xs bg-white"
								on:click={() => saveWindowColor('#ffffff')}
							/>
							<button
								class="btn btn-square btn-xs bg-black"
								on:click={() => saveWindowColor('#000000')}
							/>
						</div>
						{#each colors as color}
							<div class="flex">
								{#each color as shade}
									<button
										class="btn btn-square btn-xs"
										style={`background-color: ${shade}`}
										on:click={() => saveWindowColor(shade)}
									/>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
		<button
			class="btn btn-xs btn-circle w-fit h-fit min-h-0 bg-transparent border-transparent bottomTippy"
			data-tippy-content="Quicksort"
			on:click={async () => await quicksort()}
		>
			<SwapVerticalOutline size="16" />
		</button>
		<button
			class="btn btn-xs btn-circle w-fit h-fit min-h-0 bg-transparent border-transparent bottomTippy"
			data-tippy-content="New Tab"
			on:click={async () => {
				if (window.id) await createTab({ active: true, windowId: +window.id });
			}}
		>
			<AddOutline size="16" />
		</button>
	</div>
	<div class="flex absolute right-2 gap-2">
		<button
			class="btn btn-xs btn-circle w-fit h-fit min-h-0 bg-transparent border-transparent bottomTippy"
			data-tippy-content={minimized ? 'Maximize' : 'Minimize'}
			on:click={async () => {
				if (window.id) await toggleMinimizedWindow(+window.id);
			}}
		>
			<label class="swap swap-rotate w-full h-full">
				<input type="checkbox" bind:checked={minimized} />
				<ChevronUpOutline size="16" class="swap-off" />
				<ChevronDownOutline size="16" class="swap-on" />
			</label>
		</button>
		<button
			class="btn btn-xs btn-circle w-fit h-fit min-h-0 hover:btn-error bg-transparent border-transparent bottomTippy"
			data-tippy-content="Close"
			on:click={async () => {
				if (window.id) await removeWindow(+window.id);
			}}
		>
			<CloseOutline size="16" />
		</button>
	</div>
</div>
