export function getSystemTheme() {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  return "light"
}

export function setTheme(theme: string) {
  if (typeof window !== "undefined") {
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(theme)
    document.documentElement.style.colorScheme = theme
  }
}
