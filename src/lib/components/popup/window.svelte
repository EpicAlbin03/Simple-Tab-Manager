<script lang="ts">
  import { Card, Button } from "$lib/components/ui"
  import Pencil2 from "svelte-radix/Pencil2.svelte"
  import Plus from "svelte-radix/Plus.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import CaretUp from "svelte-radix/CaretUp.svelte"
  import Cross2 from "svelte-radix/Cross2.svelte"
  import { Sortable } from "$lib/components/popup"

  type Props = {
    window: chrome.windows.Window
    i: number
    gridView: boolean
  }

  let { window, i, gridView }: Props = $props()
</script>

<Card.Root class="max-w-xs w-full h-fit">
  <Card.Header class="p-4 flex flex-row items-center gap-2 space-y-0">
    <div class="flex justify-between w-full">
      <div class="flex gap-2 items-center">
        <Card.Title class="truncate max-w-32 text-base">Window {i + 1}</Card.Title>
        <div class="flex gap-0">
          <Button variant="ghost" size="icon" class="h-6 w-6">
            <Pencil2 class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-6 w-6">
            <CaretSort class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-6 w-6">
            <Plus class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div class="flex gap-0">
        <Button variant="ghost" size="icon" class="h-6 w-6">
          <CaretUp class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" class="h-6 w-6">
          <Cross2 class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </Card.Header>
  <Card.Content class="p-4 pt-0">
    {#if window.tabs}
      <Sortable tabs={window.tabs} {gridView} />
    {/if}
  </Card.Content>
</Card.Root>
