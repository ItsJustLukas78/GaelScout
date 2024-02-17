"use client"
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import React, {useState} from "react";
import AnimatedTextCharacter from "@/components/AnimatedTextCharacter";
import SpringAnimatedElement from "@/components/SpringAnimatedElement";
import {useUser} from "@clerk/nextjs";
import {MdSearch} from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEventNote } from "react-icons/md";
import {FaStar} from "react-icons/fa";


// Z indexes
// 50 - Modals
// 40 - Navbar

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  //
  // const handleMouseMove = (e: any) => {
  //   const x = e.clientX / window.innerWidth;
  //   const y = e.clientY / window.innerHeight;
  //   setCursorPosition({ x, y });
  // };
  //
  // const coordinateStyles = {
  //   transform: `translate(-${cursorPosition.x * 30}px, -${cursorPosition.y * 30}px)`,
  //   transition: "transform 0.5s"
  // }

  return (
    <main>
      <div className="flex w-full items-center justify-center py-28 xs:py-32">
        <div className="flex flex-col gap-72">
          <div className="relative flex h-auto flex-col lg:items-start items-center animHeading lg:space-x-8 lg:flex-row">
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <AnimatedTextCharacter className="lg:pt-10 text-5xl font-bold xs:text-7xl sm:text-8xl text-shadow-lg shadow-stone-500" delay={0.4} interval={0.6} text="Scouting Done Easy."/>
              <SpringAnimatedElement className="text-base sm:text-xl" delay={1.6}>
                Enhance your VEX Robotics scouting with GaelScout – your all-in-one solution for team data, match results, rankings, efficient note-taking, and a competitive edge.
              </SpringAnimatedElement>
              <SpringAnimatedElement delay={1.6} className="">
                {isSignedIn ? (
                  <p className="text-base sm:text-xl">
                    Enjoy your smooth scouting experience with GaelScout, {user.firstName}!
                  </p>
                  )
                : <>
                  <SpringAnimatedElement className="text-base sm:text-xl mb-8" delay={1.6}>
                    Enjoy your smooth scouting experience with GaelScout! Sign up to access all features.
                  </SpringAnimatedElement>
                  <Link href="sign-up">
                    <CorneredButton className="h-8 w-33 text-2xl font-semibold">
                      Sign Up
                    </CorneredButton>
                  </Link>
                  </>
                }
              </SpringAnimatedElement>
            </div>
            <div className="hidden max-w-[600px] lg:block">
              <SpringAnimatedElement className="hidden max-w-lg lg:flex lg:flex-col" delay={1.6}>
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
              </SpringAnimatedElement>
            </div>
          </div>
          <SpringAnimatedElement className="flex h-auto flex-col items-center pb-16 animHeading lg:space-x-8 lg:flex-row" delay={1.6}>
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <div className="text-4xl font-bold xs:text-5xl sm:text-7xl text-shadow-lg shadow-stone-500">
                Developed by members of Gael Force Robotics
              </div>
              <p className="text-base sm:text-xl">
                GaelScout was developed by Gael Force Robotics students, for students.
              </p>
              <p className="text-base sm:text-xl">
                Scouting teams can be challenging, with a vast amount of participants,
                few to no reliable methods of communication, limited resources, and
                difficulty distinguishing teams from one another in competition.
              </p>
              <p className="text-base sm:text-xl">
                GaelScout&apos;s history originates back in 2019, starting as an app offering
                team information and scouting notes, with a neural network match predictor
                as its standout feature.
              </p>
              <p className="text-base sm:text-xl">
                Our members have brought back GaelScout, now serving the features of VEX Via,
                VEX DB, and its predecessor in a single application to tackle these challenges.
              </p>
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
          </SpringAnimatedElement>
          <div className="-mt-64 flex-col items-center lg:hidden flex">
            <iframe
              className="rounded-xl sm:hidden block"
              src="https://discord.com/widget?id=1175614341941313647&theme=dark"
              width="250" height="400"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
            <iframe
              className="rounded-xl hidden sm:block"
              src="https://discord.com/widget?id=1175614341941313647&theme=dark"
              width="500" height="500"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
          </div>
        </div>
        <SpringAnimatedElement delay={1.6} className="fixed z-50 self-center bottom-[175px] flex items-center flex-col justify-center">
          <div className="flex items-center justify-center bg-neutral-800 rounded-full h-10 w-48">
            <div className="ml-7 flex gap-3">
              <FaStar
                onClick={() => window.location.href = "/favorites"}
                className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"/>
              <hr className="h-5 w-0.5 bg-neutral-600 border-none"/>
              <FaPeopleGroup
                onClick={() => window.location.href = "/teams"}
                className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"/>
              <hr className="h-5 w-0.5 bg-neutral-600 border-none"/>
              <MdEventNote
                onClick={() => window.location.href = "/events"}
                className="h-5 w-5 hover:cursor-pointer hover:text-neutral-600"
              />
            </div>
            <MdSearch className="h-5 w-5 ml-auto mr-2.5 text-neutral-500"/>
          </div>
        </SpringAnimatedElement>
      </div>
    </main>
  )
}
