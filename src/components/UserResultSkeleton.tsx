
export default function UserResultSkeleton() {
  return (
    <div className="rounded-2xl bg-neutral-300 w-full p-3 h-24 shadow-lg shadow-neutral-500 flex flex-col">
      <div className="animate-pulse flex flex-col gap-2">
        <div className="bg-gray-400 h-4 w-1/2 rounded"></div>
        <div className="bg-gray-400 h-4 w-1/3 rounded"></div>
        <div className="bg-gray-400 h-4 w-1/4 rounded"></div>
      </div>

      <div className="animate-pulse flex flex-row gap-2 items-center">
        <div className="w-24 h-24 relative">
          <div className="rounded-full bg-gray-400"></div>
        </div>
        <div className="bg-gray-400 xs:text-md text-sm font-bold text-gray-900"></div>
      </div>
    </div>
  )
}