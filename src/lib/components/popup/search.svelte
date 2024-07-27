<script lang="ts">
  import MagnifyingGlass from "svelte-radix/MagnifyingGlass.svelte"
  import EyeOpen from "svelte-radix/EyeOpen.svelte"
  import EyeNone from "svelte-radix/EyeNone.svelte"
  import { Button, Input } from "$lib/components/ui"
  import { setStorage } from "$lib/chrome/options"

  type Props = {
    hideOnSearch: boolean
  }

  let { hideOnSearch }: Props = $props()

  let isHideOnSearch = $state(hideOnSearch)
</script>

<div class="flex gap-1 w-full">
  <div class="relative">
    <MagnifyingGlass class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
    <Input type="search" placeholder="Search..." class="bg-background w-full pl-8 max-w-60" />
  </div>

  <Button
    variant="outline"
    size="icon"
    onclick={async () => {
      isHideOnSearch = !isHideOnSearch
      await setStorage("hideOnSearch", isHideOnSearch)
    }}
  >
    {#if isHideOnSearch}
      <EyeOpen class="h-4 w-4" />
    {:else}
      <EyeNone class="h-4 w-4" />
    {/if}
  </Button>
</div>
