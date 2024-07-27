<script lang="ts">
  import { NavBottom, NavTop } from "$lib/components/popup"
  import type { PageData } from "./$types"

  const { data }: { data: PageData } = $props()
  const { gridView, hideOnSearch } = data
</script>

<div class="border h-full w-full bg-muted/40 flex flex-col justify-between">
  <NavTop />
  <NavBottom {gridView} {hideOnSearch} />
</div>
