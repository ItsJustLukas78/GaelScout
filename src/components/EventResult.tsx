import Link from 'next/link'

export default function TeamResult({ id, sku, name, start, location } :
{ id: number, sku: string, name: string, start: string, location: string }) {
  return (
    <Link
      href={`/events/${sku}`}
      className="rounded-2xl bg-neutral-300 w-full p-3 min-h-28 h-auto shadow-lg shadow-neutral-500 flex flex-col"
    >
      <h1 className="md:text-lg text-sm font-bold text-gray-900 mb-2">
        {name}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>SKU:</strong> {sku}
        </h2>
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>Location:</strong> {location}
        </h2>
        <h2 className="md:text-sm text-xs font-semibold text-gray-900">
          <strong>Start:</strong> {(new Date(start)).toLocaleString(undefined, {
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