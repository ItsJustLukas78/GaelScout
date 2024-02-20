import Link from 'next/link'

export default function EventResult({ id, sku, name, start, location, dark=true, defaultTeam }:
{ id: number, sku: string, name: string, start: string, location: string, dark?: boolean, defaultTeam?: string }) {
  return (
    <Link
      href={`/events/${sku}${defaultTeam ? `?team=${defaultTeam}` : ''}`}
      className={`flex h-auto w-full flex-col rounded-xl p-2 shadow-lg transition-colors duration-200 ${dark ? 'bgColorSecondary shadow-neutral-900 hover:bgColorSecondaryHover' : 'bgColorSecondary shadow-neutral-800 hover:bgColorSecondaryHover'}`}
    >
      <h1 className="text-sm mb-1 font-bold md:text-lg w-full outlinedText">
        {name}
      </h1>
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-semibold md:text-sm outlinedText">
          {location}
        </h2>
        <h2 className="text-xs font-semibold md:text-sm outlinedText">
          {(new Date(start)).toLocaleString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'GMT',
            })
          }
        </h2>
      </div>
    </Link>
  )
}