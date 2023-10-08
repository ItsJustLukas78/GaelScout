import Link from 'next/link'

export default function TeamResult({ id, sku, name, start, location } :
{ id: number, sku: string, name: string, start: string, location: string }) {
  return (
    <Link
      href={`/events/${sku}`}
      className="duration-200 transition-colors hover:bg-gray-400 flex h-auto w-full flex-col rounded-2xl bg-neutral-300 p-3 shadow-lg shadow-neutral-500 min-h-28"
    >
      <h1 className="mb-2 text-sm font-bold text-gray-900 md:text-lg">
        {name}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          {sku}
        </h2>
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          {location}
        </h2>
        <h2 className="text-xs font-semibold text-gray-900 md:text-sm">
          {(new Date(start)).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }
        </h2>
      </div>
    </Link>
  )
}