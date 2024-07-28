import { isChromeExtension } from "$lib/chrome"
import type { PageLoad } from "./$types"
import { dummyWindows } from "$lib/dummydata"

export const load: PageLoad = async (event) => {
  let windows: chrome.windows.Window[] = []

  if (isChromeExtension()) {
    // const res = await getWindows()
    windows = []
  } else {
    windows = dummyWindows
  }

  return {
    windows,
  }
}
