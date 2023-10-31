import React from 'react'

export default function ColorGradient({ className, children, colors, mix = true }: {
  className?: string,
  children: React.ReactNode,
  colors: string[],
  mix?: boolean
}) {
  return (
    <div className={`flex flox-row ${className}`}>
      {children}
      {colors.map((color, index) => {
        return (
          <div key={index} className={`${mix ? "mix-blend-multiply" :  ""} ${color} min-h-min min-w-[25%]`}>
          </div>
        )
      })}
    </div>
  )
}
