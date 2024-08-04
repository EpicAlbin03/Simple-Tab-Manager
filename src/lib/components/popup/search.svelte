<script lang="ts">
  import MagnifyingGlass from "svelte-radix/MagnifyingGlass.svelte"
  import EyeOpen from "svelte-radix/EyeOpen.svelte"
  import EyeNone from "svelte-radix/EyeNone.svelte"
  import { Button, Input } from "$lib/components/ui"
  import { setStorage } from "$lib/chrome/options"
  import { getContext } from "svelte"
  import { type Options } from "$lib/chrome/options"

  const options: Options = getContext("options")
  let searchView = $state(options.searchView)

  let searchValue = $state("")

  function search() {
    const tabs = Array.from(document.querySelectorAll(".tab")) as HTMLElement[]
    for (const tab of tabs) {
      if (searchValue === "") {
        tab.classList.remove("opacity-30")
        tab.classList.remove("hidden")
      }

      if (tab.textContent?.toLowerCase().includes(searchValue.toLowerCase())) {
        if (searchView === "hide") tab.classList.remove("opacity-30")
        else tab.classList.remove("hidden")
      } else {
        if (searchView === "hide") {
          tab.classList.remove("opacity-30")
          tab.classList.add("hidden")
        } else {
          tab.classList.remove("hidden")
          tab.classList.add("opacity-30")
        }
      }
    }
  }
</script>

<div class="flex gap-1 w-full">
  <div class="relative max-w-60 w-full">
    <MagnifyingGlass class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
    <Input
      type="search"
      placeholder="Search..."
      class="bg-background w-full pl-8"
      bind:value={searchValue}
      oninput={search}
    />
  </div>

  <Button
    variant="ghost"
    size="icon"
    onclick={async () => {
      searchView = searchView === "show" ? "hide" : "show"
      search()
      await setStorage("searchView", searchView)
    }}
  >
    {#if searchView === "show"}
      <EyeOpen class="h-4 w-4" />
    {:else}
      <EyeNone class="h-4 w-4" />
    {/if}
  </Button>
</div>
