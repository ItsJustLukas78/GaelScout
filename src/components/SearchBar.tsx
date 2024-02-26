import React from "react";
import {MdSearch} from "react-icons/md";
import {TiDeleteOutline} from "react-icons/ti";

export default function SearchBar({ value, changeValue, placeholder } : { value: string, changeValue: (value: string) => void, placeholder: string }) {
  return (
    <div className="relative flex flex-row min-w-max items-center">
      <MdSearch className="absolute left-2 text-lg sm:text-xl text-black"/>
      <input
        className="h-8 w-full pl-8 p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg bg-white rounded-lg"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => changeValue(e.target.value)}
      />
      <TiDeleteOutline
        className="absolute right-2 text-lg sm:text-xl cursor-pointer text-black"
        onClick={() => changeValue("")}
      />
    </div>
  )
}