
export default function TeamResultSkeleton() {
  return (
    <div className="rounded-2xl bg-neutral-200 w-full p-3 h-28 shadow-lg shadow-neutral-500 flex flex-col">
      <div className="animate-pulse flex flex-col gap-2">
        <div className="bg-gray-400 h-4 w-1/2 rounded"></div>
        <div className="bg-gray-400 h-4 w-1/3 rounded"></div>
        <div className="bg-gray-400 h-4 w-1/4 rounded"></div>
      </div>
    </div>
  )
}