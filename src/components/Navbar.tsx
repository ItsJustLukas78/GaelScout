"use client"
import NavButton from './NavButton'
import Image from 'next/image'
import {
  GiHamburgerMenu
} from "react-icons/gi";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";


export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div className="z-50 h-20 w-full fixed top-0 bg-GSGray bg-opacity-50 lg:justify-center items-center xl:gap-16 lg:gap-10 inline-flex bg-gradient-to-b
   from-neutral-800  to-GSGray">
        <div className="ml-5 inline-flex items-center">
          <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
          <NavButton href="/">GaelScout</NavButton>
        </div>
        <div className="hidden lg:inline-flex lg:gap-11 xl:gap-20">
          <NavButton href="/">Home</NavButton>
          <NavButton href="/teams">Teams</NavButton>
          <NavButton href="/predict">Predict</NavButton>
          <NavButton href="/api-docs">API</NavButton>
          <NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>
          <NavButton href="/about">About</NavButton>
          {isLoaded && isSignedIn ? <UserButton afterSignOutUrl="/"/> :
            <NavButton href="/sign-in">Sign In</NavButton>
          }
        </div>
        <div className="ml-auto mr-10 lg:hidden">
          <button
              className="w-[35px] h-[35px] inline-flex items-center justify-center"
              aria-label="Customise options"
              onClick={() => setExpanded(!expanded)}
            >
              <GiHamburgerMenu className="h-6 w-6"/>
            </button>
        </div>
      </div>
      <div className={`${expanded ? "block" : "hidden"} lg:hidden`}>
        <div className="z-50 h-full w-full fixed top-20 bg-GSGray bg-opacity-100 lg:justify-center
         bg-gradient-to-b" >
          <div onClick={() => setExpanded(!expanded)} className="mt-5 ml-10 flex flex-col gap-10">
            <NavButton href="/">Home</NavButton>
            <NavButton href="/teams">Teams</NavButton>
            <NavButton href="/predict">Predict</NavButton>
            <NavButton href="/api-docs">API</NavButton>
            <NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>
            <NavButton href="/about">About</NavButton>
            {/*<button*/}
            {/*  className="whitespace-nowrap w-fit text-white text-2xl font-semibold h-auto"*/}
            {/*  onClick={() => {*/}
            {/*    if (status === "authenticated") {*/}
            {/*      signOut();*/}
            {/*    } else {*/}
            {/*      signIn();*/}
            {/*    }*/}
            {/*  }}*/}
            {/*>*/}
            {isLoaded && isSignedIn ? <UserButton afterSignOutUrl="/"/> :
            <NavButton href="/sign-in">Sign In</NavButton>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
