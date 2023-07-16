import React from 'react'
import Link from 'next/link'

export default function Navbutton({ href, children }: { href: string , children: React.ReactNode }) {
  return (
    <Link
      className="whitespace-nowrap w-fit text-white text-2xl font-semibold h-auto"
      href={href}
    >
      {children}
    </Link>
  )
}
