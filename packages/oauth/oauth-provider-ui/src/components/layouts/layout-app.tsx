import { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { ReactNode } from 'react'
import { useCustomizationData } from '#/contexts/customization.tsx'
import { LocaleSelector } from '#/locales/locale-selector.tsx'
import { LinkAnchor } from '../utils/link-anchor.tsx'

export type LayoutAppProps = {
  children?: ReactNode
  header?: ReactNode
  title?: string | MessageDescriptor
}

export function LayoutApp({ children, header, title }: LayoutAppProps) {
  const { _ } = useLingui()
  const { logo, name, links } = useCustomizationData()
  const titleString = typeof title === 'object' ? _(title) : title ?? name

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <header className="flex items-center justify-between gap-4 p-4">
        {titleString && <title>{titleString}</title>}
        {logo && (
          // The page-specific title (e.g. "Devices") still surfaces via
          // <title> below and, on LayoutPage screens, its own inline
          // heading — so this header can stay the persistent brand
          // wordmark rather than switching to whatever title is passed in.
          <h1 className="text-text-default flex min-w-0 items-center truncate text-xl font-light">
            <img
              src={logo}
              alt={name || _(msg`Logo`)}
              className="mr-3 h-6 object-contain object-left"
            />
            <span className="font-masthead text-2xl">{name}</span>
          </h1>
        )}

        {header}
      </header>

      <div className="flex w-full min-w-0 max-w-full flex-1 flex-col items-center justify-center">
        {children}
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-4 px-6 py-4 text-xs md:px-8">
        <LocaleSelector className="mr-auto text-sm" />

        {links?.map((link) => (
          <LinkAnchor
            key={link.href}
            link={link}
            className="text-text-light hover:underline focus:underline focus:outline-none"
          />
        ))}
      </footer>
    </div>
  )
}
