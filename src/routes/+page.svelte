<script lang="ts">
  import { NavBottom, NavTop, Window } from "$lib/components/popup"
  import { addWindowEventListeners, removeWindowEventListeners } from "$lib/chrome/windows"
  import { createTabViewStore, createWindowStore } from "$lib/stores.svelte"
  import { getContext, setContext } from "svelte"
  import type { Options } from "$lib/chrome/options"
  import { addTabEventListeners, removeTabEventListeners } from "$lib/chrome/tabs"

  const windowStore = createWindowStore()

  $effect(() => {
    addWindowEventListeners(windowStore.refreshWindows)
    addTabEventListeners(windowStore.refreshWindows)

    return () => {
      removeWindowEventListeners(windowStore.refreshWindows)
      removeTabEventListeners(windowStore.refreshWindows)
    }
  })

  const options: Options = getContext("options")
  const tabViewStore = createTabViewStore(options.tabView)
  setContext("tabViewStore", tabViewStore)
</script>

<div class="border h-full w-full bg-muted/40 flex flex-col justify-between">
  <NavTop />

  <div class="overflow-auto h-full p-2">
    <div class="flex flex-wrap gap-2">
      {#key windowStore.windows}
        {#if windowStore.windows}
          {#each windowStore.windows as window, i}
            <Window {window} {i} />
          {/each}
        {/if}
      {/key}
    </div>
  </div>

  <NavBottom />
</div>
