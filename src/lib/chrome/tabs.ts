import { get } from "svelte/store"
import Sortable from "sortablejs"
import { isChromeExtension } from "$lib/chrome"

export function addTabEventListeners(refreshWindows: (...args: any[]) => void) {
  if (isChromeExtension()) {
    chrome.tabs.onCreated.addListener(refreshWindows)
    chrome.tabs.onRemoved.addListener(refreshWindows)
    chrome.tabs.onUpdated.addListener(refreshWindows)
    chrome.tabs.onMoved.addListener(refreshWindows)
  }
}

export function removeTabEventListeners(refreshWindows: (...args: any[]) => void) {
  if (isChromeExtension()) {
    chrome.tabs.onCreated.removeListener(refreshWindows)
    chrome.tabs.onRemoved.removeListener(refreshWindows)
    chrome.tabs.onUpdated.removeListener(refreshWindows)
    chrome.tabs.onMoved.removeListener(refreshWindows)
  }
}

// export async function queryTabs(queryInfo: chrome.tabs.QueryInfo = {}) {
//   return await chrome.tabs.query(queryInfo)
// }

// export async function getTab(tabId: number) {
//   return await chrome.tabs.get(tabId)
// }

// export async function openTab(tabId: number, windowId: number) {
//   await chrome.windows.update(windowId, { focused: true })
//   await chrome.tabs.update(tabId, { active: true })
// }

// export async function removeSelectedTabs() {
//   const selectedTabs = get(selectedTabsStore)
//   const tabIds = selectedTabs.map((tab) => +tab.id)
//   await chrome.tabs.remove(tabIds)
// }

// export async function pinSelectedTabs() {
//   const selectedTabs = get(selectedTabsStore)
//   const updatePromises = selectedTabs.map(async (selectedTab) => {
//     const tab = await getTab(+selectedTab.id)
//     return await chrome.tabs.update(+selectedTab.id, { pinned: !tab.pinned })
//   })
//   await Promise.all(updatePromises)
// }

// export async function muteSelectedTabs() {
//   const selectedTabs = get(selectedTabsStore)
//   const updatePromises = selectedTabs.map(async (selectedTab) => {
//     const tab = await getTab(+selectedTab.id)
//     return await chrome.tabs.update(+selectedTab.id, { muted: !tab.mutedInfo?.muted })
//   })
//   await Promise.all(updatePromises)
// }

// export async function pinTab(tabId: number) {
//   return await chrome.tabs.update(tabId, { pinned: true })
// }

// export function selectTab(tab: HTMLElement) {
//   Sortable.utils.select(tab)
//   selectedTabsStore.update((tabs) => [...tabs, tab])
//   windowsStore.reload?.()
// }

// export function deselectTab(tab: HTMLElement) {
//   Sortable.utils.deselect(tab)
//   selectedTabsStore.update((tabs) => tabs.filter((t) => t.id !== tab.id))
//   windowsStore.reload?.()
// }

// export async function createTab(createProperties: chrome.tabs.CreateProperties = {}) {
//   return await chrome.tabs.create(createProperties)
// }

// export async function removeTab(tabId: number) {
//   return await chrome.tabs.remove(tabId)
// }

// export async function moveTab(tabId: number, moveProperties: chrome.tabs.MoveProperties) {
//   return await chrome.tabs.move(tabId, moveProperties)
// }

// export async function getPinnedTabs(windowId: number) {
//   return await chrome.tabs.query({ windowId, pinned: true })
// }

// export async function unPinTabs(windowId: number) {
//   const pinnedTabs = await getPinnedTabs(windowId)
//   for (const tab of pinnedTabs) {
//     if (tab.id) await chrome.tabs.update(+tab.id, { pinned: false })
//   }
// }

// export async function titleSort(window: chrome.windows.Window) {
//   let pinnedTabs: chrome.tabs.Tab[] = []
//   if (window.id) {
//     pinnedTabs = await getPinnedTabs(+window.id)
//     await unPinTabs(+window.id)
//   }

//   const tabs = window.tabs?.sort((a, b) => {
//     if (a.title && b.title) {
//       if (a.title < b.title) return -1
//       if (a.title > b.title) return 1
//     }
//     return 0
//   })
//   for (const [i, tab] of tabs?.entries() ?? []) {
//     if (tab.id) await moveTab(tab.id, { index: i })
//   }

//   for (const tab of pinnedTabs) {
//     if (tab.id) await pinTab(+tab.id)
//   }
// }

// export async function urlSort(window: chrome.windows.Window) {
//   let pinnedTabs: chrome.tabs.Tab[] = []
//   if (window.id) {
//     pinnedTabs = await getPinnedTabs(+window.id)
//     await unPinTabs(+window.id)
//   }

//   const tabs = window.tabs?.sort((a, b) => {
//     if (a.url && b.url) {
//       if (a.url < b.url) return -1
//       if (a.url > b.url) return 1
//     }
//     return 0
//   })
//   for (const [i, tab] of tabs?.entries() ?? []) {
//     if (tab.id) await moveTab(tab.id, { index: i })
//   }

//   for (const tab of pinnedTabs) {
//     if (tab.id) await pinTab(+tab.id)
//   }
// }
