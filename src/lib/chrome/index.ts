export function isChromeExtension() {
  return typeof window !== "undefined" && window.chrome && chrome.runtime && chrome.runtime.id
}
