import NavButton from './NavButton'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className="absolute bottom-0 h-20 w-full items-center justify-center gap-16 flex bg-gradient-to-t
   from-neutral-800 to-GSGray">
      {/*<div className="inline-flex items-center">*/}
      {/*  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />*/}
      {/*  <NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>*/}
      {/*</div>*/}
      <div className="flex lg:gap-20 items-center gap-5">
        <p className="sm:text-lg text-xs">
          Copyright © 2023 Lukas Somwong
        </p>
        <NavButton href="/privacy">Privacy</NavButton>
      </div>
    </div>
  )
}