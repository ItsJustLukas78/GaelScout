import Link from 'next/link'
import { GiNotebook } from 'react-icons/gi';

export default function MatchTeamResult({ teamId, teamNumber, teamName, programCode, teamGrade, location, teamOrg, openMatchNotes } :
{ teamId: number, teamNumber: string, teamName: string, programCode: string, teamGrade: string, location: string, teamOrg: string, openMatchNotes: (teamId: number) => void}) {
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-row rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28 items-center"
    >
      <div className="flex flex-col">
        <h1 className="mb-2 text-lg font-bold md:text-2xl">
          {teamNumber} - {teamName}
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xs font-semibold md:text-sm">
            {location}
          </h2>
          <h2 className="text-2xs font-semibold md:text-sm">
            {teamOrg}
          </h2>
        </div>
      </div>
      <button
        className="opacity-50 flex sm:mr-3 min-w-[50px] min-h-[40px] whitespace-nowrap rounded-md bg-neutral-50 text-xl font-semibold text-black disabled:opacity-50 ml-auto items-center justify-center"
        onClick={(e) => {
          e.preventDefault()
          openMatchNotes(teamId)
        }}
      >
        <GiNotebook className="inline-block" />
      </button>
    </Link>
  )
}