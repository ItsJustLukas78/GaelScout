import { EventRankWithMetrics } from "@/app/types";
import { TeamProfile } from "@/app/types";
import Link from 'next/link'

// Component to display a team's rank in an event

interface EventRankComponentProps {
  rank: EventRankWithMetrics,
  team: TeamProfile
}
export default function EventRankComponent({ rank, team }: EventRankComponentProps) {
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className="flex flex-col h-auto w-full items-center rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28 transition-colors duration-200 hover:bg-neutral-600"
    >
      <div className="flex flex-row w-full">
        <h1 className="mb-2 text-sm font-medium md:text-2xl">
          <span className="font-bold">{team.teamNumber}</span> - {team.teamName}
        </h1>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-semibold text-2xs md:text-sm">
            Rank: {rank.rank}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-auto">
            WP: {rank.wp}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-3">
            AP: {rank.ap}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-auto">
            SP: {rank.sp}
          </h2>
        </div>
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-semibold text-2xs md:text-sm">
            {`${rank.wins}-${rank.losses}-${rank.ties}`}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-auto">
            OPR: {rank.opr}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-3">
            DPR: {rank.dpr}
          </h2>
          <h2 className="font-semibold text-2xs md:text-sm ml-auto">
            CCWM: {rank.ccwm}
          </h2>
        </div>
      </div>
    </Link>
  )
}