"use client"
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import React, {useEffect} from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { motion } from "framer-motion"
import useResizeObserver from '@react-hook/resize-observer'
import AnimatedTextCharacter from "@/components/AnimatedTextCharacter";
import SpringAnimatedElement from "@/components/SpringAnimatedElement";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

export default function Home() {

  return (
    <main>
      <div className="py-28 xs:py-32 flex w-full items-center justify-center">
        <div className="flex flex-col gap-72">
          <div className="animHeading items-center flex h-auto flex-col lg:space-x-8 lg:flex-row">
            <div className="flex flex-col space-y-8 w-72 xs:w-96 sm:w-144 lg:w-128 xl:w-144 p-1">
              <AnimatedTextCharacter className="text-5xl font-bold xs:text-7xl sm:text-8xl" delay={0.4} interval={0.4} text="Scouting Done Easy."/>
              <AnimatedTextCharacter className="text-base sm:text-xl" delay={1.2} text="Improve your scouting experience in the VEX Robotics competition with all the tools you need in one place. Access data
                on other teams, and tools to get an upper hand in scouting, and winning competitions.
                Check team stats beyond what is provided in VEX Via, view match results, efficiently take notes, and more.
              "/>
              <AnimatedTextCharacter className="text-base sm:text-xl" delay={3.7} text="Sign up to access all of GaelScouts features for a better scouting experience.
              "/>
              <SpringAnimatedElement delay={4.5} className="">
                <Link href="sign-up">
                  <CorneredButton className="text-2xl font-semibold">
                    Sign-Up
                  </CorneredButton>
                </Link>
              </SpringAnimatedElement>
            </div>
            <div className="hidden lg:block max-w-[600px]">
              <SpringAnimatedElement className="hidden max-w-lg lg:flex-col lg:flex" delay={4.5}>
                 <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image priority={true} src="/homeblob1.svg" alt="GaelSuite Logo" width="400" height="200" className="hover:rotate-6 transition-all"/>
                </Tilt>
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image priority={true} src="/homeblob2.svg" alt="GaelSuite Logo" width="400" height="200" className="hover:rotate-6 transition-all"/>
                </Tilt>
              </SpringAnimatedElement>
            </div>
          </div>
          <SpringAnimatedElement className="animHeading pb-16 flex h-auto flex-col items-center justify-center lg:space-x-8 lg:flex-row" delay={4.5}>
            <div className="flex flex-col space-y-8 w-72 xs:w-96 sm:w-144 lg:w-128 xl:w-144 p-1">
              <div className="text-4xl font-bold xs:text-5xl sm:text-7xl">
                Developed by students at GaelSuite.
              </div>
              <p className="text-base sm:text-xl">
                GaelScout was developed by GaelSuite, a nonprofit established by members
                of the Gael Force 5327 Organization.
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
            <div className="hidden xl:block max-w-[426px]">
              <div className="hidden max-w-lg flex-row flex-wrap xl:max-w-128 xl:flex">
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" className="hover:rotate-12 transition-all"/>
                </Tilt>
                {/*<Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>*/}
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200" className="hover:rotate-12 transition-all"/>
                </Tilt>
              </div>
            </div>
            <div className="xl:hidden lg:block hidden max-w-[426px]">
              <div className="xl:hidden hidden max-w-lg flex-row flex-wrap xl:max-w-128 lg:flex">
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" className="hover:rotate-12 transition-all"/>
                </Tilt>
                {/*<Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>*/}
                <Tilt
                  tiltMaxAngleX={20}
                  tiltMaxAngleY={20}
                >
                  <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200" className="hover:rotate-12 transition-all"/>
                </Tilt>
              </div>
            </div>
          </SpringAnimatedElement>
        </div>
      </div>
    </main>
  )
}
