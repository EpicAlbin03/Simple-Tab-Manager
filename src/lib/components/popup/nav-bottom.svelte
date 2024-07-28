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

  type Props = {
    gridView: boolean
    hideOnSearch: boolean
  }

  let { gridView, hideOnSearch }: Props = $props()

  let isGridView = $state(gridView)
</script>

<div class="bg-background flex justify-between items-center p-1 border-t">
  <Search {hideOnSearch} />

  <div class="flex gap-1">
    <Button variant="outline" size="icon" class="bg-green-300 hover:bg-green-400/75">
      <Plus class="h-4 w-4 text-green-900" />
    </Button>
    <Button variant="outline" size="icon" class="bg-yellow-300 hover:bg-yellow-400/75">
      <Bookmark class="h-4 w-4 text-yellow-900" />
    </Button>
    <Button variant="outline" size="icon" class="bg-yellow-300 hover:bg-yellow-400/75">
      <SpeakerOff class="h-4 w-4 text-yellow-900" />
    </Button>
    <Button variant="outline" size="icon" class="bg-yellow-300 hover:bg-yellow-400/75">
      <DrawingPin class="h-4 w-4 text-yellow-900" />
    </Button>
    <Button variant="outline" size="icon" class="bg-red-300 hover:bg-red-400/75">
      <Trash class="h-4 w-4 text-red-900" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      onclick={async () => {
        isGridView = !isGridView
        await setStorage("gridView", isGridView)
      }}
    >
      {#if isGridView}
        <ListBullet class="h-4 w-4" />
      {:else}
        <Grid class="h-4 w-4" />
      {/if}
    </Button>
  </div>
</div>
