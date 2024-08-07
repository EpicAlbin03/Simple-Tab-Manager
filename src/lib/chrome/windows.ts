import { dummyWindows } from "$lib/dummydata"
import { isChromeExtension } from "$lib/chrome"

export function addWindowEventListeners(refreshWindows: (...args: any[]) => void) {
  if (isChromeExtension()) {
    chrome.windows.onCreated.addListener(refreshWindows)
    chrome.windows.onRemoved.addListener(refreshWindows)
    chrome.windows.onFocusChanged.addListener(refreshWindows)
  }
}

export function removeWindowEventListeners(refreshWindows: (...args: any[]) => void) {
  if (isChromeExtension()) {
    chrome.windows.onCreated.removeListener(refreshWindows)
    chrome.windows.onRemoved.removeListener(refreshWindows)
    chrome.windows.onFocusChanged.removeListener(refreshWindows)
  }
}

export async function getAllWindows() {
  if (isChromeExtension()) {
    return await chrome.windows.getAll({ populate: true })
  } else {
    return dummyWindows
  }
}

export async function getWindow(
  windowId: number,
  populate: { populate: boolean } = { populate: true }
) {
  return await chrome.windows.get(windowId, populate)
}

export async function getLastFocusedWindow() {
  if (isChromeExtension()) {
    return await chrome.windows.getLastFocused()
  } else {
    return dummyWindows[0]
  }
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

// ! Popup loses focus and closes when minimizing window, don't think this fixable
export async function toggleMinimizedWindow(windowId: number) {
  const window = await getWindow(windowId, { populate: false })
  if (window.state === "minimized") {
    return await chrome.windows.update(windowId, { state: "normal", focused: true })
  } else {
    return await chrome.windows.update(windowId, { state: "minimized" })
  }
}
