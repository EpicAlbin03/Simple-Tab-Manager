<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import "../app.css"
  import type { LayoutData } from "./$types"

  const { children, data }: { children: Snippet<[]>, data: LayoutData} = $props()
  const {options} = data
  setContext("options", options)
</script>

{@render children()}
