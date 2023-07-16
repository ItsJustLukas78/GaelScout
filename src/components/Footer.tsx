import NavButton from './NavButton'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className="h-20 w-full justify-center items-center gap-16 inline-flex">
      <div className="inline-flex items-center">
        <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
        <NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>
      </div>
      <div className="gap-20 inline-flex">
        <NavButton href="/contact">Contact</NavButton>
      </div>
    </div>
  )
}