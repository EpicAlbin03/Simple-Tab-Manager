import { dummyWindows } from "$lib/dummydata"
import { isChromeExtension } from "$lib/chrome"

export function addWindowEventListeners(updateWindows: (windows: chrome.windows.Window[]) => void) {
  async function refreshWindows() {
    const windows = await getAllWindows()
    updateWindows(windows)
  }

  if (isChromeExtension()) {
    chrome.windows.onCreated.addListener(refreshWindows)
    chrome.windows.onRemoved.addListener(refreshWindows)
    chrome.windows.onFocusChanged.addListener(refreshWindows)
  }

  refreshWindows()
}

export async function getAllWindows() {
  if (isChromeExtension()) {
    return await chrome.windows.getAll({ populate: true })
  } else {
    return dummyWindows
  }
}

export async function getWindow(windowId: number) {
  return await chrome.windows.get(windowId, { populate: true })
}

export async function createEmptyWindow() {
  return await chrome.windows.create({ focused: true })
}

export async function removeWindow(windowId: number) {
  return await chrome.windows.remove(windowId)
}

export async function openWindow(windowId: number) {
  return await chrome.windows.update(windowId, { focused: true })
}

export async function toggleMinimizedWindow(windowId: number) {
  const window = await getWindow(windowId)
  if (window?.state === "minimized") {
    return await chrome.windows.update(windowId, { state: "normal", focused: true })
  } else {
    return await chrome.windows.update(windowId, { state: "minimized" })
  }
}
