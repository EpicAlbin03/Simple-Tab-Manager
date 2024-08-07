<script lang="ts">
  import { Card, Button } from "$lib/components/ui"
  import Pencil2 from "svelte-radix/Pencil2.svelte"
  import Plus from "svelte-radix/Plus.svelte"
  import CaretSort from "svelte-radix/CaretSort.svelte"
  import CaretUp from "svelte-radix/CaretUp.svelte"
  import CaretDown from "svelte-radix/CaretDown.svelte"
  import Cross2 from "svelte-radix/Cross2.svelte"
  import { Sortable } from "$lib/components/popup"
  import { getLastFocusedWindow, removeWindow, toggleMinimizedWindow } from "$lib/chrome/windows"

  type Props = {
    window: chrome.windows.Window
    i: number
  }

  let { window, i }: Props = $props()

  let minimized = $state(window.state === "minimized")
</script>

{#await getLastFocusedWindow() then lastFocusedWindow}
  <Card.Root
    class={`max-w-xs w-full h-fit ${window.id === lastFocusedWindow.id ? "border-card-foreground" : ""}`}
  >
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
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            onclick={async () => {
              minimized = !minimized
              if (window.id) await toggleMinimizedWindow(window.id)
            }}
          >
            {#if minimized}
              <CaretDown class="h-4 w-4" />
            {:else}
              <CaretUp class="h-4 w-4" />
            {/if}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            onclick={async () => {
              if (window.id) await removeWindow(window.id)
            }}
          >
            <Cross2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card.Header>

    <Card.Content class={`!pt-0 ${window.state !== "minimized" ? "p-4" : "p-0"}`}>
      {#if window.tabs && window.state !== "minimized"}
        <Sortable tabs={window.tabs} />
      {/if}
    </Card.Content>
  </Card.Root>{/await}
