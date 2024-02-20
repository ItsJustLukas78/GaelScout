
export default function TeamResultSkeleton() {
  return (
    <div className="flex h-28 w-full flex-col rounded-2xl bgColorSecondary p-3 shadow-lg shadow-neutral-500">
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-4 w-1/2 rounded bgColorSecondaryHover"></div>
        <div className="h-4 w-1/3 rounded bgColorSecondaryHover"></div>
        <div className="h-4 w-1/4 rounded bgColorSecondaryHover"></div>
      </div>
    </div>
  )
}