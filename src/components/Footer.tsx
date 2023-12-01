import NavButton from './NavButton'

export default function Footer() {
  return (
    <div className="absolute bottom-0 h-20 w-full items-center justify-center gap-16 flex bg-gradient-to-t
   from-neutral-800 to-GSGray">
      <div className="flex items-center gap-5 lg:gap-20">
        <p className="text-xs sm:text-sm">
          Copyright © 2023
        </p>
        <NavButton className="!text-sm !xl:text-sm !sm::text-sm" href="/privacy">Privacy</NavButton>
      </div>
    </div>
  )
}