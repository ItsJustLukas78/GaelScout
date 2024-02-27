import {CombinedTeamSkills, TeamProfile, TeamSeasonProfile} from '@/app/types'
import Link from "next/link";

interface SkillsResultProps {
  skills: CombinedTeamSkills,
  seasonProfile?: TeamSeasonProfile
}

export default function SkillsResult(
  { skills: { teamId, teamNumber, teamName, progSkills, totalSkills, driverSkills, progAttempts, driverAttempts, rank }, seasonProfile }: SkillsResultProps
)
{
  return (
    <Link
      href={`/teams/${teamNumber}`}
      className="flex h-auto w-full flex-col rounded-xl bgColorSecondary p-2 px-3 shadow-lg shadow-neutral-900 transition-colors duration-200 hover:bgColorSecondaryHover"
    >
      <div className="relative flex w-full flex-row">
        <h1 className="mb-2 text-sm font-medium md:text-2xl outlinedText line-clamp-2">
          <span className="font-extrabold">{teamNumber}</span> - {teamName}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row w-full [&>*]:w-1/4 items-center justify-between">
          <div className="flex flex-col w-full">
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Rank: {rank}
            </h2>
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Total: {totalSkills}
            </h2>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Prog: {progSkills}
            </h2>
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Attempts: {progAttempts}
            </h2>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Driver: {driverSkills}
            </h2>
            <h2 className="font-bold text-2xs md:text-sm outlinedText">
              Attempts: {driverAttempts}
            </h2>
          </div>
          <div className="flex flex-col w-full">
            <h2 className={`font-bold text-2xs md:text-sm outlinedText ${seasonProfile?.qualToRegionals ? "text-green-500" : "text-red-500"}`}>
              Regionals: {seasonProfile?.qualToRegionals ? "Yes" : "No"}
            </h2>
            <h2 className={`font-bold text-2xs md:text-sm outlinedText ${seasonProfile?.awardQualToWorlds ? "text-green-500" : "text-red-500"}`}>
              Worlds: {seasonProfile?.awardQualToWorlds ? "Yes" : "No"}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  )
}