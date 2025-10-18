<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils';
	import { MinusIcon, PlusIcon } from '@lucide/svelte';
	import { onDestroy } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		minValue?: number;
		maxValue?: number;
		timerDuration?: number;
	} & WithElementRef<Omit<HTMLInputAttributes, 'type'>>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		'data-slot': dataSlot = 'input',
		minValue = 0,
		maxValue = 9999,
		timerDuration = 100,
		...restProps
	}: Props = $props();

	let timer: ReturnType<typeof setInterval> | null = null;

	function updateCount(val: number) {
		if (val >= minValue && val <= maxValue) {
			value = val;
		}
	}

	function startIncrement() {
		updateCount(Number(value) + 1);
		timer = setInterval(() => {
			updateCount(Number(value) + 1);
		}, timerDuration);
	}

	function startDecrement() {
		updateCount(Number(value) - 1);
		timer = setInterval(() => {
			updateCount(Number(value) - 1);
		}, timerDuration);
	}

	function stopCounting() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<div
	class={cn(
		'relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40',
		className
	)}
>
	<button
		onmousedown={startDecrement}
		onmouseup={stopCounting}
		onmouseleave={stopCounting}
		class="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
	>
		<MinusIcon class="size-4" />
		<span class="sr-only">Decrement</span>
	</button>
	<input
		bind:this={ref}
		data-slot={dataSlot}
		bind:value={() => value, (v) => updateCount(v)}
		class="w-full grow px-3 py-2 text-center tabular-nums outline-none selection:bg-primary selection:text-primary-foreground"
		{...restProps}
	/>
	<button
		onmousedown={startIncrement}
		onmouseup={stopCounting}
		onmouseleave={stopCounting}
		class="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input bg-background text-sm text-muted-foreground transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
	>
		<PlusIcon class="size-4" />
		<span class="sr-only">Increment</span>
	</button>
</div>
