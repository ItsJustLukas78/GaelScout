"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MdSearch } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";


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
      className={`fixed z-50 items-center justify-center bg-neutral-700 rounded-full w-52 h-10 2xs:w-72 2xs:h-12 p-1 transition-all duration-500 bottom-20 transform ${hidden ? "-left-72" : ""} ${fullyHidden ? "hidden" : ""}`}
    >
      <form
        className="relative h-full w-full"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = `/teams/${(document.querySelector("input") as HTMLInputElement).value}`
        }}
      >
        <input
          className="h-full w-full rounded-full bg-white text-center text-md 2xs:text-xl font-semibold text-black placeholder-neutral-400 placeholder-opacity-100"
          type="text"
          disabled={hidden}
          placeholder="Team Quicksearch"
        />
        <button
          className="absolute items-center justify-center bg-transparent text-black right-0.5 bottom-0.5"
          onClick={() => {
            window.location.href = `/teams/${(document.querySelector("input") as HTMLInputElement).value}`
          }}
        >
          <MdSearch className="absolute right-1 bottom-1 2xs:h-6 2xs:w-6 h-5 w-5"/>
        </button>
      </form>
      <div
        className="relative flex justify-center"
      >
        <button
          className={`absolute flex items-center text-white justify-center bg-neutral-700 w-6 h-7 ${hidden ? "-right-[23px] bottom-1.5 rounded-r-xl" : "-left-[23px] bottom-1.5 rounded-l-xl"}`}
          onClick={() => {
            setHidden(!hidden);
          }}
        >
          {hidden ?
            <IoIosArrowForward className="h-5 w-5"/> :
            <IoIosArrowBack className="h-5 w-5"/>
          }
        </button>
      </div>
    </div>
  );
}