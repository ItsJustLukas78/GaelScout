import Link from 'next/link'

export default function EventResult({ id, sku, name, start, location, dark=false, defaultTeam }:
{ id: number, sku: string, name: string, start: string, location: string, dark?: boolean, defaultTeam?: string }) {
  return (
    <Link
      href={`/events/${sku}${defaultTeam ? `?team=${defaultTeam}` : ''}`}
      className={`flex h-auto w-full flex-col rounded-2xl p-3 shadow-lg transition-colors duration-200 min-h-28 ${dark ? 'bg-neutral-700 shadow-neutral-900 hover:bg-neutral-600' : 'bg-neutral-300 shadow-neutral-500 hover:bg-gray-400 [&>*]:text-gray-900'}`}
    >
      <h1 className="mb-2 text-sm font-bold md:text-lg">
        {name}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold md:text-sm">
          {sku}
        </h2>
        <h2 className="text-xs font-semibold md:text-sm">
          {location}
        </h2>
        <h2 className="text-xs font-semibold md:text-sm">
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