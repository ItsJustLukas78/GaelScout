import NavButton from './NavButton'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className="h-20 w-full fixed top-0 bg-black bg-opacity-50 justify-center items-center gap-16 inline-flex bg-gradient-to-b
 from-black via-gray-800">
      <div className="inline-flex items-center">
        <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
        <NavButton href="/home">GaelScout</NavButton>
      </div>
      <div className="gap-20 inline-flex">
        <NavButton href="/">Home</NavButton>
        <NavButton href="/teams">Teams</NavButton>
        <NavButton href="/predict">Predict</NavButton>
        <NavButton href="/api">API</NavButton>
        <NavButton href="/gaelsuite">GaelSuite</NavButton>
        <NavButton href="/about">About</NavButton>
        <NavButton href="/login">Sign In</NavButton>
      </div>
    </div>
  )
}
