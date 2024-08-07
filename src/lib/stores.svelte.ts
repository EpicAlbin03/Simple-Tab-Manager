import { getAllWindows } from "$lib/chrome/windows"

export type TabViewStore = ReturnType<typeof createTabViewStore>

export function createTabViewStore(initialView = "list") {
  let tabView = $state(initialView)

  function toggleTabView() {
    tabView = tabView === "list" ? "grid" : "list"
  }

  return {
    get tabView() {
      return tabView
    },
    toggleTabView,
  }
}

export function createWindowStore() {
  let windows: chrome.windows.Window[] = $state([])

  async function refreshWindows() {
    windows = await getAllWindows()
  }

  // Initial refresh
  refreshWindows()

  return {
    get windows() {
      return windows
    },
    refreshWindows,
  }
}
