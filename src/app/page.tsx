import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className="w-full items-center justify-center flex flex-col my-28 gap-20">
        <div className="h-auto items-center justify-center flex flex-col lg:flex-row lg:space-x-8">
          <div className="xl:w-144 lg:w-128 sm:w-144 xs:w-96 w-72 my-16 inline-flex flex-col space-y-8">
            <h1 className="sm:text-8xl xs:text-7xl text-5xl font-bold ">
              Scouting Done Easy.
            </h1>
            <p className="sm:text-xl text-base">
              Providing VEX Robotics Competition teams an accessible resource of data and
              analysis on other teams to get an upper hand in scouting, and winning competitions.
              Manage a team page, where you can share more about your team, and communicate with others.
            </p>
            <p className="sm:text-xl text-base">
              Manage a team, communicate with other users, and gain access to our API.
            </p>
            <Link href="sign-up">
              <CorneredButton>Sign Up</CorneredButton>
            </Link>
          </div>
          <div className="max-w-lg xl:inline-flex hidden">
            <Image priority src="/homeblobs.png" alt="GaelSuite Logo" width="600" height="600"/>
          </div>
          <div className="max-w-lg inline-flex xl:hidden">
            <Image priority src="/homeblobs.png" alt="GaelSuite Logo" width="400" height="400"/>
          </div>
        </div>
        <div className="h-auto my-15 items-center justify-center flex flex-col lg:flex-row lg:space-x-8">
          <div className="xl:w-144 lg:w-128 sm:w-144 xs:w-96 w-72 my-16 inline-flex flex-col space-y-8">
            <h1 className="sm:text-8xl xs:text-6xl text-5xl font-bold ">
              Developed by students at GaelSuite.
            </h1>
            <p className="sm:text-xl text-base">
              GaelScout was developed by GaelSuite, a nonprofit established by members
              of the Gael Force 5327 Organization. Scouting teams can be challenging,
              with a vast amount of participants, few to no reliable methods of communication,
              limited resources, and difficulty distinguishing teams from one another in
              competition. Our members have created GaelScout in order to tackle that
              challenge, and wanted to bring it to the VRC community.
            </p>
          </div>
          <div className="xl:max-w-128 xl:flex max-w-lg flex-row flex-wrap hidden">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="200" height="200" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="200" height="200"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="200" height="200"/>
          </div>
          <div className="sm:flex max-w-sm flex-row flex-wrap hidden xl:hidden">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="175" height="200" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="175" height="200"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="175" height="200"/>
          </div>
          <div className="max-w-80 flex flex-row flex-wrap justify-center items-center sm:hidden">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="150" height="100" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="150" height="100"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="150" height="100"/>
          </div>
        </div>
      </div>
    </main>
  )
}
