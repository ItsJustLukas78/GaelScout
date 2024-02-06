
export default function NotFound() {

  return <>
    <main>
      <div className="flex w-full flex-col items-center justify-center gap-16 py-32 sm:py-32 md:flex-row md:gap-12 lg:gap-20">
        <div className="flex h-auto max-w-min flex-col items-center justify-center lg:flex-row lg:items-start">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="text-3xl font-bold text-gray-300">Page not found</h2>
            <p className="text-xl text-gray-300 text-center">That doesnt exist silly, get back to scouting!</p>
          </div>
        </div>
      </div>
    </main>
  </>
}