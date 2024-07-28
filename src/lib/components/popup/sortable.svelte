<script lang="ts">
  import Sortable from "sortablejs"
  import { Toggle } from "$lib/components/ui"
  import { onMount } from "svelte"

  type Props = {
    tabs: chrome.tabs.Tab[]
    gridView: boolean
  }

  let { tabs, gridView }: Props = $props()

  let sortableList: HTMLUListElement

  onMount(async () => {
    const { MultiDrag } = await import("sortablejs")
    try {
      Sortable.mount(new MultiDrag())
    } catch (error) {}

    const sortable = new Sortable(sortableList, {
      group: "shared",
      animation: 150,
      swapThreshold: 0.65,
      multiDrag: true,
      selectedClass: "sortable-selected",
      fallbackTolerance: 3,
      avoidImplicitDeselect: true,
      scroll: true,
      forceAutoScrollFallback: true,
      scrollSensitivity: 50,
      scrollSpeed: 10,
      bubbleScroll: true,
    })
  })
</script>

<ul bind:this={sortableList}>
  {#each tabs as tab}
    {#if gridView}
      <li>
        {tab.title}
      </li>
    {:else}
      <li>
        <Toggle size="sm" aria-label={tab.title} class="gap-2 w-full justify-start relative">
          <img src={tab.favIconUrl} alt={tab.title} width="12" height="12" class="absolute" />
          <span class="truncate pl-5">
            {tab.title}
          </span>
        </Toggle>
      </li>
    {/if}
  {/each}
</ul>
