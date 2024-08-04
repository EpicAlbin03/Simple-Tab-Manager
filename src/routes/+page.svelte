<script lang="ts">
  import { NavBottom, NavTop, Window } from "$lib/components/popup"
  import { addWindowEventListeners } from "$lib/chrome/windows"
  import { createTabViewStore } from "$lib/stores.svelte"
  import { getContext, setContext } from "svelte"
  import type { Options } from "$lib/chrome/options"

  let windows: chrome.windows.Window[] = $state([])

  $effect(() => {
    addWindowEventListeners((newWindows) => {
      windows = newWindows
    })
  })

  const options: Options = getContext("options")
  const tabViewStore = createTabViewStore(options.tabView)
  setContext("tabViewStore", tabViewStore)
</script>

<div class="border h-full w-full bg-muted/40 flex flex-col justify-between">
  <NavTop />

  <div class="overflow-auto h-full p-2">
    <div class="flex flex-wrap gap-2">
      {#if windows}
        {#each windows as window, i}
          <Window {window} {i} />
        {/each}
      {/if}
    </div>
  </div>

  <NavBottom />
</div>
