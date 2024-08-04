import { isChromeExtension } from "$lib/chrome"

export type Options = {
  theme: "light" | "dark"
  tabView: "grid" | "list"
  searchView: "hide" | "show"
}

export async function getStorage(keys: string[]): Promise<any> {
  return new Promise((resolve) => {
    if (!isChromeExtension()) resolve({})

    chrome.storage.sync.get(keys, (res) => {
      resolve(res)
    })
  })
}

export async function setStorage(key: string, value: any): Promise<void> {
  return new Promise((resolve) => {
    if (!isChromeExtension()) resolve()

    chrome.storage.sync.set({ [key]: value }, () => {
      resolve()
    })
  })
}
