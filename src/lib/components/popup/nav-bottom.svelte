<script lang="ts">
  import Grid from "svelte-radix/Grid.svelte"
  import ListBullet from "svelte-radix/ListBullet.svelte"
  import Trash from "svelte-radix/Trash.svelte"
  import Plus from "svelte-radix/Plus.svelte"
  import Bookmark from "svelte-radix/Bookmark.svelte"
  import SpeakerOff from "svelte-radix/SpeakerOff.svelte"
  import DrawingPin from "svelte-radix/DrawingPin.svelte"
  import { Button } from "$lib/components/ui"
  import { setStorage } from "$lib/chrome/options"
  import { Search } from "$lib/components/popup"
  import { createEmptyWindow } from "$lib/chrome/windows"
  import { getContext } from "svelte"
  import { type TabViewStore } from "$lib/stores.svelte"

  const tabViewStore: TabViewStore = getContext("tabViewStore")
</script>

<div class="bg-background flex justify-between items-center p-1 border-t">
  <Search />

  <div class="flex gap-1">
    <Button variant="ghost" size="icon" onclick={() => createEmptyWindow()}>
      <Plus class="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon">
      <Bookmark class="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon">
      <SpeakerOff class="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon">
      <DrawingPin class="h-4 w-4" />
    </Button>

    <Button variant="ghost" size="icon">
      <Trash class="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onclick={async () => {
        tabViewStore.toggleTabView()
        await setStorage("tabView", tabViewStore.tabView)
      }}
    >
      {#if tabViewStore.tabView === "list"}
        <ListBullet class="h-4 w-4" />
      {:else}
        <Grid class="h-4 w-4" />
      {/if}
    </Button>
  </div>
</div>
