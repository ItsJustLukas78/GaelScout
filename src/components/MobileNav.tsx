"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";


export default function QuickSearch() {
  const router = useRouter();

  // Arrows on right and left to go back or forward in history without using the browser buttons

  return (
    <div
      className="fixed z-50 bottom-32 h-12 w-full flex items-center justify-between"
    >
      <button
        className="flex items-center ml-4 md:ml-12 justify-center rounded-full bg-neutral-700 text-white w-8 h-8 sm:w-10 sm:h-10 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bg-neutral-600"
        onClick={() => {
          router.back();
        }}
      >
        <FaAngleLeft className="text-2xl" />
      </button>
      <button
        className="flex items-center mr-4 md:mr-12 justify-center rounded-full bg-neutral-700 text-white w-8 h-8 sm:w-10 sm:h-10 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bg-neutral-600"
        onClick={() => {
          router.forward();
        }}
      >
        <FaAngleRight className="text-2xl" />
      </button>
    </div>
  );
}