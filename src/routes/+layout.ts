import { getStorage } from "$lib/chrome/options"
import { isChromeExtension } from "$lib/chrome"
import type { LayoutLoad } from "./$types"

export const prerender = true

export const load: LayoutLoad = async (event) => {
  let options = {
    gridView: false,
    hideOnSearch: false,
  }

  if (isChromeExtension()) {
    const res = await getStorage(["gridView", "hideOnSearch"])
    options = {
      gridView: res.gridView ?? options.gridView,
      hideOnSearch: res.hideOnSearch ?? options.hideOnSearch,
    }
  }

  return {
    options,
  }
}
