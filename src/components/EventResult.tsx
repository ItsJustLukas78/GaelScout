import Link from 'next/link'

export default function EventResult({ id, sku, name, start, location, dark=true, defaultTeam }:
{ id: number, sku: string, name: string, start: string, location: string, dark?: boolean, defaultTeam?: string }) {
  return (
    <Link
      href={`/events/${sku}${defaultTeam ? `?team=${defaultTeam}` : ''}`}
      className={`flex h-auto w-full flex-col rounded-xl p-2 shadow-lg transition-colors duration-200 ${dark ? 'bg-neutral-800 shadow-neutral-900 hover:bg-neutral-700' : 'bg-neutral-700 shadow-neutral-700 hover:bg-neutral-500'}`}
    >
      <h1 className="text-sm mb-1 font-semibold md:text-lg line-clamp-1 w-full">
        {name}
      </h1>
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-normal md:text-sm">
          {location}
        </h2>
        <h2 className="text-xs font-normal md:text-sm">
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