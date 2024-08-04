import { getStorage, type Options } from "$lib/chrome/options"
import { getSystemTheme, setTheme } from "$lib/theme"
import type { LayoutLoad } from "./$types"

export const prerender = true

export const load: LayoutLoad = async () => {
  const systemTheme = getSystemTheme()
  setTheme(systemTheme)

  let defaultOptions: Options = {
    theme: systemTheme,
    tabView: "list",
    searchView: "show",
  }

  const storage = await getStorage(["tabView", "searchView", "theme"])
  const options: Options = {
    tabView: storage.tabView ?? defaultOptions.tabView,
    searchView: storage.searchView ?? defaultOptions.searchView,
    theme: storage.theme ?? defaultOptions.theme,
  }

  return {
    options,
  }
}
