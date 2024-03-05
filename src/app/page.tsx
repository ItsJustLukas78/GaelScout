"use client"
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import React from "react";
import Balancer from 'react-wrap-balancer'
import {useUser} from "@clerk/nextjs";

// Z indexes
// 50 - Modals
// 40 - Navbar

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <main>
      <div className="flex w-full items-center justify-center py-28 xs:py-32">
        <div className="flex flex-col gap-72">
          <div className="relative flex h-auto flex-col items-center lg:space-x-8 lg:flex-row lg:items-start">
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <Balancer className="text-5xl font-bold shadow-stone-500 text-shadow-lg xs:text-7xl sm:text-8xl lg:pt-10">
                Scouting Done Easy.
              </Balancer>
              <Balancer className="text-base sm:text-xl">
                Enhance your VEX Robotics scouting with GaelScout – your all-in-one solution for team data, match results, rankings, efficient note-taking, and a competitive edge.
              </Balancer>
              <div>
                {isSignedIn ? (
                  <Balancer className="text-base sm:text-xl">
                    Enjoy your smooth scouting experience with GaelScout, {user.firstName}!
                  </Balancer>
                  )
                : <>
                  <Balancer className="mb-8 text-base sm:text-xl">
                    Enjoy your smooth scouting experience with GaelScout! Sign up to access all features.
                  </Balancer>
                  <Link href="sign-up">
                    <CorneredButton className="h-8 text-2xl font-semibold w-33">
                      Sign Up
                    </CorneredButton>
                  </Link>
                  </>
                }
              </div>
            </div>
            <div className="hidden max-w-[600px] lg:block">
              <div className="hidden max-w-lg lg:flex lg:flex-col">
                 <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image priority={true} src="/homeblob1.svg" alt="Robotics Students" width="400" height="200" className="transition-all hover:rotate-6"/>
                </Tilt>
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image priority={true} src="/homeblob2.svg" alt="Robotics Students" width="400" height="200" className="transition-all hover:rotate-6"/>
                </Tilt>
              </div>
            </div>
          </div>
          <div className="flex h-auto flex-col items-center pb-16 lg:space-x-8 lg:flex-row">
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <Balancer className="text-4xl font-bold shadow-stone-500 text-shadow-lg xs:text-5xl sm:text-7xl">
                Developed by members of Gael Force Robotics
              </Balancer>
              <Balancer className="text-base sm:text-xl">
                GaelScout was developed by Gael Force Robotics students, for students.
              </Balancer>
              <Balancer className="text-base sm:text-xl">
                Scouting teams can be challenging, with a vast amount of participants,
                few to no reliable methods of communication, limited resources, and
                difficulty distinguishing teams from one another in competition.
              </Balancer>
              <Balancer className="text-base sm:text-xl">
                GaelScout&apos;s history originates back in 2019, starting as an app offering
                team information and scouting notes, with a neural network match predictor
                as its standout feature.
              </Balancer>
              <Balancer className="text-base sm:text-xl">
                Our members have brought back GaelScout, now serving the features of VEX Via,
                VEX DB, and its predecessor in a single application, dependent only on RobotEvents,
                to tackle these challenges.
              </Balancer>
            </div>
            <div className="hidden max-w-[426px] lg:block">
              <div className="hidden max-w-lg flex-row flex-wrap lg:flex xl:max-w-128">
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/gfnew.png" alt="GFR Logo" width="200" height="200" className="transition-all hover:rotate-12"/>
                </Tilt>
                <iframe
                  className="rounded-xl"
                  src="https://discord.com/widget?id=1175614341941313647&theme=dark"
                  width="350" height="500"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                >
                </iframe>
              </div>
            </div>
          </div>
          <div className="-mt-64 flex flex-col items-center lg:hidden">
            <iframe
              className="block rounded-xl sm:hidden"
              src="https://discord.com/widget?id=1175614341941313647&theme=dark"
              width="300" height="400"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
            <iframe
              className="hidden rounded-xl sm:block"
              src="https://discord.com/widget?id=1175614341941313647&theme=dark"
              width="500" height="500"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
          </div>
        </div>
        {/*<div className="fixed z-50 flex flex-col items-center justify-center self-center bottom-[175px]">*/}
        {/*  <div className="flex h-10 w-48 items-center justify-center rounded-full bgColorPrimary">*/}
        {/*    <div className="ml-7 flex gap-3">*/}
        {/*      <FaStar*/}
        {/*        onClick={() => window.location.href = "/favorites"}*/}
        {/*        className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"/>*/}
        {/*      <hr className="h-5 border-none w-0.5 bgColorSecondaryHover"/>*/}
        {/*      <FaPeopleGroup*/}
        {/*        onClick={() => window.location.href = "/teams"}*/}
        {/*        className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"/>*/}
        {/*      <hr className="h-5 border-none w-0.5 bgColorSecondaryHover"/>*/}
        {/*      <MdEventNote*/}
        {/*        onClick={() => window.location.href = "/events"}*/}
        {/*        className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <MdSearch className="ml-auto h-5 w-5 text-neutral-500 mr-2.5"/>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </main>
  )
}
