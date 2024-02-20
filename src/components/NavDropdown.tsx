import React from 'react'
import { useState } from 'react'
import { BiSolidDownArrow } from "react-icons/bi";

export default function NavDropDown({ children }: { children: React.ReactNode }) {

  const [expanded, setExpanded] = useState(false);


  return <>
    <button
      className="h-auto w-fit whitespace-nowrap font-semibold text-white group lg:text-lg xl:text-xl"
      onClick={() => setExpanded(!expanded)}
    >
      Tools
      <BiSolidDownArrow className="ml-2 inline-flex h-2.5 w-2.5"/>
      {expanded &&
        <div
          className="absolute hidden flex-col rounded-md bgColorPrimary px-5 py-3 shadow-gray-500 translate-x-[-20%] group-hover:flex"
        >
          {children}
        </div>
      }
    </button>
  </>
}
