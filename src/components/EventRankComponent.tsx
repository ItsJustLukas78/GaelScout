import { EventRankWithMetrics } from "@/app/types";
import { TeamProfile } from "@/app/types";
import Link from 'next/link'

interface EventRankComponentProps {
  rank: EventRankWithMetrics,
  team: TeamProfile
}
export default function EventRankComponent({ rank, team }: EventRankComponentProps) {
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className="flex h-auto w-full flex-col items-center rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 transition-colors duration-200 min-h-28 hover:bg-neutral-600"
    >
      <div className="flex w-full flex-row">
        <h1 className="mb-2 text-sm font-medium md:text-2xl">
          <span className="font-bold">{team.teamNumber}</span> - {team.teamName}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-semibold text-2xs md:text-sm">
            Rank: {rank.rank}
          </h2>
          <h2 className="ml-auto font-semibold text-2xs md:text-sm">
            WP: {rank.wp}
          </h2>
          <h2 className="ml-3 font-semibold text-2xs md:text-sm">
            AP: {rank.ap}
          </h2>
          <h2 className="ml-auto font-semibold text-2xs md:text-sm">
            SP: {rank.sp}
          </h2>
        </div>
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-semibold text-2xs md:text-sm">
            {`${rank.wins}-${rank.losses}-${rank.ties}`}
          </h2>
          <h2 className="ml-auto font-semibold text-2xs md:text-sm">
            OPR: {rank.opr}
          </h2>
          <h2 className="ml-3 font-semibold text-2xs md:text-sm">
            DPR: {rank.dpr}
          </h2>
          <h2 className="ml-auto font-semibold text-2xs md:text-sm">
            CCWM: {rank.ccwm}
          </h2>
        </div>
      </div>
    </Link>
  )
}