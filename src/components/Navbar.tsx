"use client"
import NavButton from './NavButton'
import Image from 'next/image'
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Divide as Hamburger } from 'hamburger-react'
import { VscAccount } from "react-icons/vsc";
import { usePathname } from "next/navigation";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEventNote } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";


export default function Navbar() {
  const path = usePathname();

  const { isLoaded, isSignedIn, user } = useUser();

  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div className="px-5 md:px-12 z-40 h-20 w-full fixed top-0 bg-GSGray bg-opacity-50 justify-center lg:justify-center items-center 2xl:gap-16 xl:gap-12 lg:gap-10 flex bg-gradient-to-b
   from-neutral-800 to-GSGray">
        <div className="hidden items-center lg:flex lg:gap-9 xl:gap-14 2xl:gap-16">
          <div onClick={() => setExpanded(false)} className="inline-flex items-center justify-center">
            <Image src="/GaelScoutLogo2024.png" alt="GaelSuite Logo" width="50" height="50" priority={true} />
            <NavButton href="/" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">GaelScout</NavButton>
          </div>
          <NavButton href="/teams" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
            <FaPeopleGroup className="inline-block h-4 w-4 mr-2.5" />
            Teams
          </NavButton>
          <NavButton href="/events" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
            <MdEventNote className="inline-block h-4 w-4 mr-2.5" />
            Events</NavButton>
          {/*<NavButton href="/profiles">Profiles</NavButton>*/}
          <NavButton href="/rankings" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
            <MdLeaderboard className="inline-block h-4 w-4 mr-2.5" />
            Rankings</NavButton>
          <NavButton href="/predict" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
            <FaQuestion className="inline-block h-4 w-4 mr-2.5" />
            Predict</NavButton>
          <NavButton href="/favorites" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
            <FaStar className="inline-block h-4 w-4 mr-2.5" />
            Favorites</NavButton>
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
          {/*    <div className="bg-clip-text text-transparent GSColorGradient">*/}
          {/*      Sign In*/}
          {/*    </div>*/}
          {/*  </NavButton>*/}
          {/*}*/}
          {isLoaded && isSignedIn ? <UserButton /> : (
            <NavButton href={`/sign-in?redirect_url=${path || "/"}`}>
              Sign In
            </NavButton>
          )}
        </div>
        <div className="mr-auto lg:hidden">
          <Hamburger toggled={expanded} toggle={setExpanded} />
        </div>
        <div onClick={() => setExpanded(false)} className="inline-flex items-center justify-center pr-7 lg:hidden">
          <Image src="/GaelScoutLogo2024.png" alt="GaelSuite Logo" width="50" height="50" priority={true} />
          <NavButton href="/" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">GaelScout</NavButton>
        </div>
        <div className="ml-auto lg:hidden">
          {isLoaded && isSignedIn ? <UserButton /> : (
            <NavButton href="/sign-in">
              <VscAccount className="inline-block text-3xl" />
            </NavButton>
          )}
        </div>
      </div>
      <div className={`${expanded ? "block" : "hidden"} lg:hidden`}>
        <div className="z-50 h-full w-full fixed top-20 bg-GSGray bg-opacity-100 lg:justify-center
         bg-gradient-to-b" >
          <div onClick={() => setExpanded(!expanded)} className="mt-5 ml-10 flex flex-col gap-8">
            <NavButton href="/teams" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
              <FaPeopleGroup className="inline-block h-5 w-5 mr-2.5" />
              Teams
            </NavButton>
            <NavButton href="/events" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
              <MdEventNote className="inline-block h-5 w-5 mr-2.5" />
              Events
            </NavButton>
            {/*<NavButton href="/profiles">Profiles</NavButton>*/}
            <NavButton href="/rankings" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
              <MdLeaderboard className="inline-block h-5 w-5 mr-2.5" />
              Rankings
            </NavButton>
            <NavButton href="/favorites" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
              <FaStar className="inline-block h-5 w-5 mr-2.5" />
              Favorites
            </NavButton>
            <NavButton href="/predict" className="text-shadow-xs shadow-[var(--color-tertiary-hover)]">
              <FaQuestion className="inline-block h-5 w-5 mr-2.5" />
              Predict
            </NavButton>
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
    </div>
  )
}
