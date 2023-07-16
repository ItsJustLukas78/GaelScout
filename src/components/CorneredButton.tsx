import React from 'react'

export default function CorneredButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-white rounded-2xl whitespace-nowrap h-8 w-28 text-black text-xl font-semibold">
      {children}
    </button>
  )
}
