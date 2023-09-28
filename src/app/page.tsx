import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className="my-28 flex w-full flex-col items-center justify-center gap-20">
        <div className="flex h-auto flex-col items-center justify-center lg:space-x-8 lg:flex-row">
          <div className="my-16 inline-flex flex-col space-y-8 w-72 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
            <h1 className="text-5xl font-bold xs:text-7xl sm:text-8xl">
              Scouting Done Easy.
            </h1>
            <p className="text-base sm:text-xl">
              Providing VEX Robotics Competition teams an accessible resource of data and
              analysis on other teams to get an upper hand in scouting, and winning competitions.
              Manage a team page, where you can share more about your team and robot, and communicate with others.
            </p>
            <p className="text-base sm:text-xl">
              Sign up to get access to more features, such as editing your team page after verification, and communicating with other users.
            </p>
            <Link href="sign-up">
              <CorneredButton>Sign Up</CorneredButton>
            </Link>
          </div>
          <div className="hidden max-w-lg xl:inline-flex">
            <Image priority={true} src="/homeblobs.png" alt="GaelSuite Logo" width="600" height="600"/>
          </div>
          <div className="inline-flex max-w-lg xl:hidden">
            <Image priority={true} src="/homeblobs.png" alt="GaelSuite Logo" width="400" height="400"/>
          </div>
        </div>
        <div className="my-15 flex h-auto flex-col items-center justify-center lg:space-x-8 lg:flex-row">
          <div className="my-16 inline-flex w-72 flex-col space-y-8 xs:w-96 sm:w-144 lg:w-128 xl:w-144">
            <h1 className="text-5xl font-bold xs:text-6xl sm:text-8xl">
              Developed by students at GaelSuite.
            </h1>
            <p className="text-base sm:text-xl">
              GaelScout was developed by Lukas from 5327S with support from GaelSuite, a nonprofit established by members
              of the Gael Force 5327 Organization. Scouting teams can be challenging,
              with a vast amount of participants, few to no reliable methods of communication,
              limited resources, and difficulty distinguishing teams from one another in
              competition. Our members have created GaelScout in order to tackle that
              challenge, and wanted to bring it to the VRC community.
            </p>
          </div>
          <div className="hidden max-w-lg flex-row flex-wrap xl:max-w-128 xl:flex">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200"/>
          </div>
          <div className="hidden max-w-sm flex-row flex-wrap sm:flex xl:hidden">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="175" height="200" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="175" height="200"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="175" height="200"/>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center max-w-80 sm:hidden">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="150" height="100" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="150" height="100"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="150" height="100"/>
          </div>
        </div>
      </div>
    </main>
  )
}
