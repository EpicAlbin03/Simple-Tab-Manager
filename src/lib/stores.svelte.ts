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
