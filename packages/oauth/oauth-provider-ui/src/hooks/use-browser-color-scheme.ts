import { useEffect, useState } from 'react'

const query =
  typeof window === 'undefined'
    ? null
    : window.matchMedia('(prefers-color-scheme: dark)')

function resolveTheme(): 'light' | 'dark' {
  // `data-theme` is set by initThemeOverride() from a `?dark=true|false`
  // URL param and takes priority over the OS preference — see the comment
  // above the `[data-theme]` rules in style.css.
  const override = document.documentElement.dataset.theme
  if (override === 'dark' || override === 'light') return override
  return query?.matches ? 'dark' : 'light'
}

export function useBrowserColorScheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window === 'undefined' ? 'light' : resolveTheme(),
  )

  useEffect(() => {
    if (!query) return

    const listener = () => {
      setTheme(resolveTheme())
    }

    query.addEventListener('change', listener)

    return () => {
      query.removeEventListener('change', listener)
    }

    // @NOTE "query" is a global constant and does not need to be part of the
    // array bellow:
  }, [])

  return theme
}
