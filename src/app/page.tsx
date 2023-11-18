"use client"
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import React from "react";
import AnimatedTextCharacter from "@/components/AnimatedTextCharacter";
import SpringAnimatedElement from "@/components/SpringAnimatedElement";
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
          <div className="flex h-auto flex-col lg:items-start items-center animHeading lg:space-x-8 lg:flex-row">
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <AnimatedTextCharacter className="lg:pt-10 text-5xl font-bold xs:text-7xl sm:text-8xl" delay={0.4} interval={0.6} text="Scouting Done Easy."/>
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
                    Sign up to access all of GaelScout&apos;s features.
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
                  <Image priority={true} src="/homeblob1.svg" alt="GaelSuite Logo" width="400" height="200" className="transition-all hover:rotate-6"/>
                </Tilt>
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image priority={true} src="/homeblob2.svg" alt="GaelSuite Logo" width="400" height="200" className="transition-all hover:rotate-6"/>
                </Tilt>
              </SpringAnimatedElement>
            </div>
          </div>
          <SpringAnimatedElement className="flex h-auto flex-col items-center justify-center pb-16 animHeading lg:space-x-8 lg:flex-row" delay={1.6}>
            <div className="flex w-72 flex-col p-1 space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
              <div className="text-4xl font-bold xs:text-5xl sm:text-7xl">
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
                Our members have created GaelScout in order to tackle that
                challenge, and wanted to bring it to the VRC community.
              </p>
            </div>
            <div className="hidden max-w-[426px] xl:block">
              <div className="hidden max-w-lg flex-row flex-wrap xl:max-w-128 xl:flex">
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" className="transition-all hover:rotate-12"/>
                </Tilt>
                {/*<Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>*/}
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200" className="transition-all hover:rotate-12"/>
                </Tilt>
              </div>
            </div>
            <div className="hidden max-w-[426px] lg:block xl:hidden">
              <div className="hidden max-w-lg flex-row flex-wrap lg:flex xl:max-w-128 xl:hidden">
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" className="transition-all hover:rotate-12"/>
                </Tilt>
                {/*<Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>*/}
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200" className="transition-all hover:rotate-12"/>
                </Tilt>
              </div>
            </div>
          </SpringAnimatedElement>
        </div>
      </div>
    </main>
  )
}
