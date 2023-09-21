import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { BiSolidDownArrow } from "react-icons/bi";

export default function NavDropDown({ children }: { children: React.ReactNode }) {

  const [expanded, setExpanded] = useState(false);


  return <>
    <button
      className="group h-auto w-fit whitespace-nowrap font-semibold text-white lg:text-lg xl:text-xl"
      onClick={() => setExpanded(!expanded)}
    >
      Tools
      <BiSolidDownArrow className="inline-flex h-2.5 w-2.5 ml-2"/>
      {expanded &&
        <div
          className="group-hover:flex absolute hidden flex-col bg-neutral-800 rounded-md shadow-gray-500 px-5 py-3 translate-x-[-20%]"
        >
          {children}
        </div>
      }
    </button>
  </>
}
