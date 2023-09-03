import React from 'react'
import Link from 'next/link'

export default function Navbutton({ external, href, children }: { external?: boolean, href: string , children: React.ReactNode }) {
  return <>
    {!external ? (
      <Link
        className="whitespace-nowrap w-fit text-white text-xl font-semibold h-auto"
        href={href}
      >
        {children}
      </Link>
    ) : (
      <a
        className="whitespace-nowrap w-fit text-white text-xl font-semibold h-auto"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {children}
      </a>
    )}
  </>
}
