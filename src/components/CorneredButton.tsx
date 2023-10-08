import React from 'react'

export default function CorneredButton({ children, className, disabled, submitFunc }: { children: React.ReactNode, className?: string, disabled?: boolean, submitFunc?: () => void }) {
  return (
    <button className={`duration-500 transition-colors hover:bg-gray-500 bg-white rounded-2xl whitespace-nowrap h-8 w-28 text-black text-xl font-semibold ${className}`} disabled={disabled} onClick={submitFunc}>
      {children}
    </button>
  )
}
