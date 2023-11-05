"use client"
import NavButton from './NavButton'
import Image from 'next/image'
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Divide as Hamburger } from 'hamburger-react'
import { VscAccount } from "react-icons/vsc";
import SpringAnimatedElement from "@/components/SpringAnimatedElement";

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [expanded, setExpanded] = React.useState(false);

  return (
    <SpringAnimatedElement delay={0.04}>
      <div className="px-5 md:px-12 z-30 h-20 w-full fixed top-0 bg-GSGray bg-opacity-50 justify-center lg:justify-center items-center 2xl:gap-16 xl:gap-12 lg:gap-10 flex bg-gradient-to-b
   from-neutral-800 to-GSGray">
        <div className="hidden lg:flex lg:gap-9 xl:gap-14 2xl:gap-16 items-center">
          <div onClick={() => setExpanded(false)} className="inline-flex items-center justify-center">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
            <NavButton href="/">GaelScout</NavButton>
          </div>
          <NavButton href="/teams">Teams</NavButton>
          <NavButton href="/events">Events</NavButton>
          <NavButton href="/profiles">Profiles</NavButton>
          <NavButton href="/rankings">Rankings</NavButton>
          <NavButton href="/predict">Predict</NavButton>
          <NavButton href="/favorites">Favorites</NavButton>
          {/*<NavButton href="/verify">Verify</NavButton>*/}
          {/*<NavDropDown>*/}
          {/*  <NavDropButton href="/predict">Predict</NavDropButton>*/}
          {/*</NavDropDown>*/}
          {/*<NavButton href="/api-docs">API</NavButton>*/}
          {/*<NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>*/}
          {/*<NavButton href="/about">About</NavButton>*/}
          {/*{isLoaded && isSignedIn ? <UserButton*/}
          {/*    afterSignOutUrl="/"*/}
          {/*  /> :*/}
          {/*  <NavButton*/}
          {/*    href="/sign-in"*/}
          {/*    transitionGray={false}*/}
          {/*  >*/}
          {/*    <div className="GSColorGradient bg-clip-text text-transparent">*/}
          {/*      Sign In*/}
          {/*    </div>*/}
          {/*  </NavButton>*/}
          {/*}*/}
          {isLoaded && isSignedIn ? <UserButton
              afterSignOutUrl="/"
            /> :
            <NavButton
              href="/sign-in"
            >
              Sign In
            </NavButton>
          }
        </div>
        <div className="lg:hidden mr-auto">
          <Hamburger toggled={expanded} toggle={setExpanded} />
        </div>
        <div onClick={() => setExpanded(false)} className="lg:hidden inline-flex items-center justify-center pr-7">
          <Image src="/GS_logo.png" alt="GaelSuite Logo" width="50" height="50" />
          <NavButton href="/">GaelScout</NavButton>
        </div>
        <div className="lg:hidden ml-auto">
          {isLoaded && isSignedIn ? <UserButton
                afterSignOutUrl="/"
              /> :
              <NavButton href="/sign-in">
                <VscAccount className="inline-block text-3xl" />
              </NavButton>
            }
        </div>
      </div>
      <div className={`${expanded ? "block" : "hidden"} lg:hidden`}>
        <div className="z-50 h-full w-full fixed top-20 bg-GSGray bg-opacity-100 lg:justify-center
         bg-gradient-to-b" >
          <div onClick={() => setExpanded(!expanded)} className="mt-5 ml-10 flex flex-col gap-8">
            <NavButton href="/teams">Teams</NavButton>
            <NavButton href="/events">Events</NavButton>
            <NavButton href="/profiles">Profiles</NavButton>
            <NavButton href="/rankings">Rankings</NavButton>
            <NavButton href="/favorites">Favorites</NavButton>
            <NavButton href="/predict">Predict</NavButton>
            {/*<NavButton href="/verify">Verify</NavButton>*/}
            {/*<NavButton href="/api-docs">API</NavButton>*/}
            {/*<NavButton external={true} href="https://www.gaelsuite.com">GaelSuite</NavButton>*/}
            {/*<NavButton href="/about">About</NavButton>*/}
            {/*<button*/}
            {/*  className="h-auto w-fit whitespace-nowrap text-2xl font-semibold text-white"*/}
            {/*  onClick={() => {*/}
            {/*    if (status === "authenticated") {*/}
            {/*      signOut();*/}
            {/*    } else {*/}
            {/*      signIn();*/}
            {/*    }*/}
            {/*  }}*/}
            {/*>*/}
          </div>
        </div>
      </div>
    </SpringAnimatedElement>
  )
}
