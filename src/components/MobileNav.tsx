"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import {IsPWA} from "@/components/IsPWA";


export default function QuickSearch() {
  const router = useRouter();
  const isPWA = IsPWA();

  // Arrows on right and left to go back or forward in history without using the browser buttons

  return (
    <div>
      {isPWA ? (
        <div className="block sm:hidden">
          <button
            className="fixed left-4 z-30 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md shadow-neutral-900 transition-colors duration-200 bottom-[175px] bgColorSecondary hover:bgColorSecondaryHover sm:h-10 sm:w-10 md:left-12"
            onClick={() => {
              router.back();
            }}
          >
            <FaAngleLeft className="text-2xl" />
          </button>
          <button
            className="fixed right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md shadow-neutral-900 transition-colors duration-200 bottom-[175px] bgColorSecondary hover:bgColorSecondaryHover sm:h-10 sm:w-10 md:right-12"
            onClick={() => {
              router.forward();
            }}
          >
            <FaAngleRight className="text-2xl" />
          </button>
        </div>
        ) : null}
    </div>
  );
}