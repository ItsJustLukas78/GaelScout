import Link from 'next/link'
import { GiNotebook } from 'react-icons/gi';
import { GrSchedule } from "react-icons/gr";
import {Event} from "@/app/types";

interface EventTeamResultProps {
  key: string,
  teamId: number,
  teamNumber: string,
  teamName: string,
  programCode: string,
  teamGrade: string,
  location: string,
  teamOrg: string,
  openMatchNotes: (teamId: number) => void,
  goToTeamMatches?: () => void,
}


export default function EventTeamResult({ teamId, teamNumber, teamName, programCode, teamGrade, location, teamOrg, openMatchNotes, goToTeamMatches} : EventTeamResultProps) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex p-2 h-auto w-full flex-row items-center rounded-2xl bg-neutral-700 px-3 shadow-md shadow-neutral-900 transition-colors duration-200 min-h-20 hover:bg-neutral-600"
    >
      <div className="flex flex-col">
        <h1 className="mb-2 text-lg font-bold md:text-2xl">
          {teamNumber} - {teamName}
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-2xs md:text-sm">
            {location}
          </h2>
        </div>
      </div>
      {goToTeamMatches && (
        <button
          className="ml-auto flex items-center justify-center whitespace-nowrap rounded-md bg-neutral-50 sm:text-xl text-lg font-semibold text-black opacity-50 sm:min-w-[50px] sm:min-h-[40px] min-w-[40px] min-h-[30px] disabled:opacity-50 sm:mr-3"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            goToTeamMatches()
          }}
        >
          <GrSchedule className="inline-block" />
        </button>
      )}
      <button
        className={`${goToTeamMatches ? "ml-1" : "ml-auto"} ml-1 flex items-center justify-center whitespace-nowrap rounded-md bg-neutral-50 sm:text-xl text-lg font-semibold text-black opacity-50 sm:min-w-[50px] sm:min-h-[40px] min-w-[40px] min-h-[30px] disabled:opacity-50 sm:mr-3`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openMatchNotes(teamId)
        }}
      >
        <GiNotebook className="inline-block" />
      </button>
    </Link>
  )
}