"use client"
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'
import Tilt from 'react-parallax-tilt';
import React from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin)

export default function Home() {

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let sections = gsap.utils.toArray(".animHeading");

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: 1.5,
          ease: 'power3.inOut',
          delay: 0.00,
          directional: true
        },
      });

      // gsap.to(".firstP", {
      //   duration: 10,
      //   text: "This is the new text",
      //   ease: "none",
      //   delay: 2,
      // });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <div className="sm:py-32 py-32 flex w-full flex-col items-center justify-center sm:gap-28 gap-56">
        <div className="animHeading flex h-auto flex-col items-center justify-center lg:space-x-8 lg:flex-row">
          <div className="inline-flex w-72 flex-col space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
            <h1 className="text-5xl font-bold xs:text-7xl sm:text-8xl">
              Scouting Done Easy.
            </h1>
            <p className="text-base sm:text-xl">
              Improve your scouting experience in the VEX Robotics competition with all the tools you need in one place. Access data
              on other teams, and tools to get an upper hand in scouting, and winning competitions.
              Check team stats beyond what is provided in VEX Via, view match results, efficiently take notes, and more.
            </p>
            <p className="text-base sm:text-xl">
              Sign up to access all of GaelScouts features for a better scouting experience.
            </p>
            <Link href="sign-up">
              <CorneredButton className="text-2xl font-semibold">
                Sign-Up
              </CorneredButton>
            </Link>
          </div>
          <div className="hidden xl:block max-w-[600px]">
            <div className="hidden xl:flex xl:flex-col">
              <Tilt
                tiltMaxAngleX={20}
                tiltMaxAngleY={20}
              >
                <Image priority={true} src="/homeblob1.svg" alt="GaelSuite Logo" width="400" height="500"/>
              </Tilt>
              <Tilt
                tiltMaxAngleX={20}
                tiltMaxAngleY={20}
              >
                <Image priority={true} src="/homeblob2.svg" alt="GaelSuite Logo" width="400" height="500"/>
              </Tilt>
            </div>
          </div>
          <div className="hidden lg:block max-w-[600px]">
            <div className="hidden max-w-lg lg:flex-col lg:flex xl:hidden">
               <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
              >
                <Image priority={true} src="/homeblob1.svg" alt="GaelSuite Logo" width="400" height="200"/>
              </Tilt>
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
              >
                <Image priority={true} src="/homeblob2.svg" alt="GaelSuite Logo" width="400" height="200"/>
              </Tilt>
            </div>
          </div>
        </div>
        <div className="animHeading flex h-auto flex-col items-center justify-center lg:space-x-8 lg:flex-row">
          <div className="inline-flex w-72 flex-col space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
            <h1 className="text-4xl font-bold xs:text-5xl sm:text-7xl">
              Developed by students at GaelSuite.
            </h1>
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
              <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" />
              <Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>
              <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200"/>
            </div>
          </div>
          <div className="hidden xl:block max-w-[426px]">
            <div className="hidden max-w-sm flex-row flex-wrap lg:flex xl:hidden">
              <Image src="/GS_logo.png" alt="GaelSuite Logo" width="175" height="200" />
              <Image src="/gfold.png" alt="GaelSuite Logo" width="175" height="200"/>
              <Image src="/gfnew.png" alt="GaelSuite Logo" width="175" height="200"/>
            </div>
          </div>
          {/*<div className="flex flex-row flex-wrap items-center justify-center max-w-80 sm:hidden">*/}
          {/*  <Image src="/GS_logo.png" alt="GaelSuite Logo" width="150" height="100" />*/}
          {/*  <Image src="/gfold.png" alt="GaelSuite Logo" width="150" height="100"/>*/}
          {/*  <Image src="/gfnew.png" alt="GaelSuite Logo" width="150" height="100"/>*/}
          {/*</div>*/}
        </div>
      </div>
    </main>
  )
}
