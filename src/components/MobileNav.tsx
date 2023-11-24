"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";


export default function QuickSearch() {
  const router = useRouter();

  // Arrows on right and left to go back or forward in history without using the browser buttons

  return (
    <div className="block sm:hidden">
      <button
        className="fixed z-50 bottom-32 flex items-center left-4 md:left-12 justify-center rounded-full bg-neutral-700 text-white w-8 h-8 sm:w-10 sm:h-10 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bg-neutral-600"
        onClick={() => {
          router.back();
        }}
      >
        <FaAngleLeft className="text-2xl" />
      </button>
      <button
        className="fixed z-50 bottom-32 flex items-center right-4 md:right-12 justify-center rounded-full bg-neutral-700 text-white w-8 h-8 sm:w-10 sm:h-10 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bg-neutral-600"
        onClick={() => {
          router.forward();
        }}
      >
        <FaAngleRight className="text-2xl" />
      </button>
    </div>
  );
}