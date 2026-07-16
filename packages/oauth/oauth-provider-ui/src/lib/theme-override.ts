// Cross-origin callers (e.g. laugh.town) can't read this app's
// sessionStorage, so they can't tell us their theme preference except
// through the URL: appending `?dark=true` (or `dark=false`) to the link
// that sends the user here. We capture that once, remember it in our own
// sessionStorage so it survives this app's own internal navigations, and
// apply it as a `data-theme` attribute that the CSS in style.css checks
// before falling back to `prefers-color-scheme`.
const STORAGE_KEY = 'theme-override'

export function initThemeOverride(): void {
  const params = new URLSearchParams(window.location.search)
  const param = params.get('dark')

  let theme: 'dark' | 'light' | null =
    param === 'true' ? 'dark' : param === 'false' ? 'light' : null

  if (theme) {
    sessionStorage.setItem(STORAGE_KEY, theme)
  } else {
    theme = sessionStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
  }

  if (theme) document.documentElement.dataset.theme = theme
}
