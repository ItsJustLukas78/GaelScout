
export default function UserResultSkeleton() {
  return (
    <div className="flex h-24 w-full flex-col rounded-2xl p-3 shadow-lg shadow-neutral-500 bgColorSecondary">
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-4 w-1/2 rounded bgColorSecondaryHover"></div>
        <div className="h-4 w-1/3 rounded bgColorSecondaryHover"></div>
        <div className="h-4 w-1/4 rounded bgColorSecondaryHover"></div>
      </div>

      <div className="flex animate-pulse flex-row items-center gap-2">
        <div className="relative h-24 w-24">
          <div className="rounded-full bgColorSecondaryHover"></div>
        </div>
        <div className="text-sm font-bold text-gray-900 bgColorSecondaryHover xs:text-md"></div>
      </div>
    </div>
  )
}