<script lang="ts">
  import Sortable from "sortablejs"
  import { Toggle } from "$lib/components/ui"
  import { getContext } from "svelte"
  import { type TabViewStore } from "$lib/stores.svelte"

  type Props = {
    tabs: chrome.tabs.Tab[]
  }

  let { tabs }: Props = $props()
  let _tabs = $state(tabs)

  const tabViewStore: TabViewStore = getContext("tabViewStore")

  $effect(() => {
    initSortable()
  })

  let sortableList: HTMLElement

  async function initSortable() {
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
  }
</script>

<ul bind:this={sortableList} class={`${tabViewStore.tabView === "grid" ? "flex gap-1" : ""}`}>
  {#each _tabs as tab}
    {#if tabViewStore.tabView === "list"}
      <li class="tab">
        <Toggle size="sm" aria-label={tab.title} class="gap-2 w-full justify-start relative">
          <img src={tab.favIconUrl} alt={tab.title} width="12" height="12" class="absolute" />
          <span class="truncate pl-5">
            {tab.title}
          </span>
        </Toggle>
      </li>
    {:else}
      <li class="tab">
        <Toggle size="sm" aria-label={tab.title}>
          <img src={tab.favIconUrl} alt={tab.title} width="12" height="12" />
        </Toggle>
      </li>
    {/if}
  {/each}
</ul>
