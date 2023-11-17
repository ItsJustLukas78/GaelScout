"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

export default function QuickSearch() {
  const path = usePathname();

  const [fullyHidden, setFullyHidden] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (path === "/sign-in" || path === "/sign-up") {
      setFullyHidden(true);
    } else {
      setFullyHidden(false);
    }
  }, [path]);



  return (
    <div
      className={`fixed z-50 items-center justify-center bg-neutral-700 rounded-full w-72 h-12 p-1 transition-all duration-500 ${hidden ? "-bottom-9" : "bottom-20"} ${fullyHidden ? "hidden" : ""}`}
    >
      <form
        className="relative w-full h-full"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = `/teams/${(document.querySelector("input") as HTMLInputElement).value}`
        }}
      >
        <input
          className="bg-white text-black text-center text-xl font-semibold placeholder-neutral-400 placeholder-opacity-100 rounded-full w-full h-full"
          type="text"
          disabled={hidden}
          placeholder="Team Quicksearch"
        />
        <button
          className="absolute right-0.5 bottom-0.5 bg-transparent text-black justify-center items-center"
          onClick={() => {
            window.location.href = `/teams/${(document.querySelector("input") as HTMLInputElement).value}`
          }}
        >
          <MdSearch className="absolute right-1 bottom-1 w-6 h-6"/>
        </button>
      </form>
      <div
        className="relative flex justify-center"
      >
        <button
          className={`absolute flex items-center text-white justify-center bg-neutral-500 w-10 h-5 ${hidden ? "-top-16 rounded-t-lg" : "-bottom-5 rounded-b-lg"}`}
          onClick={() => {
            setHidden(!hidden);
          }}
        >
          {hidden ?
            <FaAngleDoubleUp className="w-5 h-5"/> :
            <FaAngleDoubleDown className="w-5 h-5"/>
          }
        </button>
      </div>
    </div>
  );
}