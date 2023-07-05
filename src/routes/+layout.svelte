<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { environmentStore } from '$lib/stores';

	onMount(() => {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        environmentStore.set('prod');
    } else {
        environmentStore.set('dev');
    }
});
</script>

<slot />
