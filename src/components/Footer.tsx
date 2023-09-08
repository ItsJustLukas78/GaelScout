import NavButton from './NavButton'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className="inline-flex h-20 w-full items-center justify-center gap-16">
      <div className="inline-flex items-center">
        <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
        <NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>
      </div>
      <div className="inline-flex gap-20">
        <NavButton href="/contact">Contact</NavButton>
      </div>
    </div>
  )
}