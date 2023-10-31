import React from 'react'
import Link from 'next/link'

export default function Navbutton({ external, href, children, className, transitionGray = true }: { external?: boolean, href: string , children: React.ReactNode, className?: string, transitionGray?: boolean }) {
  return <>
    {!external ? (
      <Link
        className={`h-auto w-fit whitespace-nowrap text-lg font-semibold transition-all duration-500 ${transitionGray ? "hover:text-gray-500" : ""} xl:text-xl hover:tracking-widest ${className}`}
        href={href}
      >
        {children}
      </Link>
    ) : (
      <a
        className={`h-auto w-fit whitespace-nowrap text-lg font-semibold transition-all duration-500 ${transitionGray ? "hover:text-gray-500" : ""} xl:text-xl hover:tracking-widest ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {children}
      </a>
    )}
  </>
}
