<script lang="ts">
  import Sun from "svelte-radix/Sun.svelte"
  import Moon from "svelte-radix/Moon.svelte"
  import Gear from "svelte-radix/Gear.svelte"
  import { Button } from "$lib/components/ui"
  import { setStorage, type Options } from "$lib/chrome/options"
  import { setTheme } from "$lib/theme"
  import { getContext } from "svelte"

  const options: Options = getContext("options")
  let theme = $state(options.theme)

  $effect(() => {
    setTheme(theme)
  })
</script>

<div class="bg-background flex justify-between items-center p-1 border-b">
  <div class="flex gap-1 ml-auto">
    <Button variant="ghost" size="icon">
      <Gear class="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onclick={async () => {
        theme = theme === "light" ? "dark" : "light"
        setTheme(theme)
        await setStorage("theme", theme)
      }}
    >
      {#if theme === "light"}
        <Sun class="h-4 w-4" />
      {:else}
        <Moon class="h-4 w-4" />
      {/if}
      <span class="sr-only">Toggle theme</span>
    </Button>
  </div>
</div>
