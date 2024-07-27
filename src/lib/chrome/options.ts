export async function getStorage(keys: string[]): Promise<any> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (res) => {
      resolve(res)
    })
  })
}

export async function setStorage(key: string, value: any): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve()
    })
  })
}
