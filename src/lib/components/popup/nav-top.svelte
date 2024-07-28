<script lang="ts">
  import Sun from "svelte-radix/Sun.svelte"
  import Moon from "svelte-radix/Moon.svelte"
  import Gear from "svelte-radix/Gear.svelte"
  import { Button } from "$lib/components/ui"
  import { toggleMode, mode } from "mode-watcher"
  import { Store } from "runed"

  const modeRune = new Store(mode)
  const theme = modeRune.current
</script>

<div class="bg-background flex justify-between items-center p-1 border-b">
  <div class="flex gap-1 ml-auto">
    <Button size="icon">
      <Gear class="h-4 w-4" />
    </Button>
    <Button variant="outline" size="icon" onclick={toggleMode}>
      {#if theme === "light"}
        <Sun class="h-4 w-4" />
      {:else}
        <Moon class="h-4 w-4" />
      {/if}
      <span class="sr-only">Toggle theme</span>
    </Button>
  </div>
</div>
