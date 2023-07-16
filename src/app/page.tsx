import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <div className="w-full items-center justify-center flex flex-col my-44 gap-20">
        <div className="h-auto my-15 items-center justify-center flex space-x-8">
          <div className="w-128 my-16 inline-flex flex-col space-y-8">
            <h1 className="text-8xl font-bold ">
              Scouting Done Easy.
            </h1>
            <p className="text-xl">
              Providing VEX Robotics Competition teams a accessible resource of data and
              analysis on other teams to get an upper hand in scouting, and winning competitions.
              Manage a team page, where you can share more about your team, and communicate with others.
            </p>
            <p className="text-xl">
              Manage a team, communicate with other users, and gain access to our API.
            </p>
            <CorneredButton>Sign Up</CorneredButton>
          </div>
          <div className="inline-flex">
            <Image priority src="/homeblobs.png" alt="GaelSuite Logo" width="500" height="600"/>
          </div>
        </div>
        <div className="h-auto my-15 items-center justify-center flex space-x-8">
          <div className="w-128 my-16 inline-flex flex-col space-y-8">
            <h1 className="text-7xl font-bold ">
              Developed by students at GaelSuite.
            </h1>
            <p className="text-xl">
              GaelScout was developed by GaelSuite, a nonprofit established by members
              of the Gael Force 5327 Organization. Scouting teams can be challenging,
              with a vast amount of participants, few to no reliable methods of communication,
              limited resources, and difficulty distinguishing teams from one another in
              competition. Our members have created GaelScout in order to tackle that
              challenge, and wanted to bring it to the VRC community.
            </p>
          </div>
          <div className="w-128 flex flex-row flex-wrap">
            <Image src="/GS_logo.png" alt="GaelSuite Logo" width="250" height="200" />
            <Image src="/gfold.png" alt="GaelSuite Logo" width="250" height="200"/>
            <Image src="/gfnew.png" alt="GaelSuite Logo" width="250" height="200"/>
          </div>
        </div>
      </div>
    </main>
  )
}
