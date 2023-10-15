import Link from 'next/link'
import { GiNotebook } from 'react-icons/gi';

export default function MatchTeamResult({ teamId, teamNumber, teamName, programCode, teamGrade, location, teamOrg, openMatchNotes } :
{ teamId: number, teamNumber: string, teamName: string, programCode: string, teamGrade: string, location: string, teamOrg: string, openMatchNotes: (teamId: number) => void}) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-row items-center rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28 transition-colors duration-200 hover:bg-neutral-600"
    >
      <div className="flex flex-col">
        <h1 className="mb-2 text-lg font-bold md:text-2xl">
          {teamNumber} - {teamName}
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-2xs md:text-sm">
            {location}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm">
            {teamOrg}
          </h2>
        </div>
      </div>
      <button
        className="ml-auto flex items-center justify-center whitespace-nowrap rounded-md bg-neutral-50 text-xl font-semibold text-black opacity-50 min-w-[50px] min-h-[40px] disabled:opacity-50 sm:mr-3"
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