import React from 'react'
import Link from 'next/link'

export default function NavDropbutton({ external, href, children }: { external?: boolean, href: string , children: React.ReactNode }) {
  return <>
    {!external ? (
      <Link
        className="h-auto w-fit whitespace-nowrap font-semibold text-white lg:text-lg xl:text-xl"
        href={href}
      >
        {children}
      </Link>
    ) : (
      <a
        className="h-auto w-fit whitespace-nowrap font-semibold text-white lg:text-lg xl:text-xl"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {children}
      </a>
    )}
  </>
}
