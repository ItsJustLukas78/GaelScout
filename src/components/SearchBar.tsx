import React from "react";
import {MdSearch} from "react-icons/md";
import {TiDeleteOutline} from "react-icons/ti";

export default function SearchBar({ value, changeValue, placeholder } : { value: string, changeValue: (value: string) => void, placeholder: string }) {
  return (
    <div className="relative flex h-min min-w-max flex-row items-center">
      <MdSearch className="absolute left-2 text-lg text-black sm:text-xl"/>
      <input
        className="h-8 w-full rounded-lg bg-white p-3 pl-8 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => changeValue(e.target.value)}
      />
      <TiDeleteOutline
        className="absolute right-2 cursor-pointer text-lg text-black sm:text-xl"
        onClick={() => changeValue("")}
      />
    </div>
  )
}