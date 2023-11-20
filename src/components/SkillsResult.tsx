import {CombinedTeamSkills, TeamProfile} from '@/app/types'
import Link from "next/link";

interface SkillsResultProps {
  skills: CombinedTeamSkills,
}

export default function SkillsResult(
  { skills: { teamId, teamNumber, teamName, progSkills, totalSkills, driverSkills, rank } }: SkillsResultProps
)
{
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-col rounded-xl bg-neutral-700 p-2 shadow-lg shadow-neutral-900 transition-colors duration-200 min-h-28 hover:bg-gray-400"
    >
      <div className="flex w-full flex-row">
        <h1 className="mb-2 text-sm font-medium md:text-2xl">
          <span className="font-bold">{teamNumber}</span> - {teamName}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row w-full [&>*]:w-1/4 items-center justify-between">
          <div className="flex flex-col w-full">
            <h2 className="font-bold text-2xs md:text-sm">
              Rank: {rank}
            </h2>
            <h2 className="font-bold text-2xs md:text-sm">
              Total: {totalSkills}
            </h2>
          </div>
          <h2 className="font-semibold text-2xs md:text-sm">
            Prog: {progSkills}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm">
            Driver: {driverSkills}
          </h2>
        </div>
      </div>
    </Link>
  )
}