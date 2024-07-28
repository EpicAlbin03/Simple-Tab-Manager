<script lang="ts">
  import { NavBottom, NavTop, Window } from "$lib/components/popup"
  import type { PageData } from "./$types"

  const { data }: { data: PageData } = $props()
  const { windows, options } = data
  const { gridView, hideOnSearch } = options
</script>

<div class="border h-full w-full bg-muted/40 flex flex-col justify-between">
  <NavTop />

  <div class="overflow-auto h-full p-2">
    <div class="flex flex-wrap gap-2">
      {#each windows as window, i}
        <Window {window} {i} {gridView} />
      {/each}
    </div>
  </div>

  <NavBottom {gridView} {hideOnSearch} />
</div>
