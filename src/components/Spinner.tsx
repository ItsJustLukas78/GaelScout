"use client"

export default function Spinner({className} : {className?: string}) {

  return (
    <div
      className={`h-8 w-8 border-4 border-solid border-t-2 border-t-white border-gray-700 rounded-full animate-spin ${className}`}
    >
    </div>
  );
}