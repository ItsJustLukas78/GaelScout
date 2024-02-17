import { EventRankWithMetrics } from "@/app/types";
import { TeamProfile } from "@/app/types";
import Link from 'next/link'

interface EventRankComponentProps {
  rank: EventRankWithMetrics,
  team: TeamProfile,
  statBrackets: {[key: string]: number},
}
export default function EventRankComponent({ rank, team, statBrackets }: EventRankComponentProps) {
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className="flex h-auto w-full flex-col items-center rounded-xl bg-neutral-700 p-2 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bg-neutral-600"
    >
      <div className="flex w-full flex-row">
        <h1 className="mb-2 text-sm font-medium md:text-2xl">
          <span className="font-extrabold">{team.teamNumber}</span> - {team.teamName}
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
          <h2 className={`ml-auto font-semibold text-2xs md:text-sm ${rank.opr ? rank.opr > statBrackets.upperOPR ? "goodGradient" : rank.opr < statBrackets.middleOPR ? "badGradient" : "midGradient" : ""}`}>
            OPR:{rank.opr.toFixed(1)}
          </h2>
          <h2 className={`ml-3 font-semibold text-2xs md:text-sm ${rank.dpr ? rank.dpr < statBrackets.upperDPR ? "goodGradient" : rank.dpr > statBrackets.middleDPR ? "badGradient" : "midGradient" : ""}`}>
            DPR: {rank.dpr.toFixed(1)}
          </h2>
          <h2 className={`ml-auto font-semibold text-2xs md:text-sm ${rank.ccwm ? rank.ccwm > statBrackets.upperCCWM ? "goodGradient" : rank.ccwm < statBrackets.middleCCWM ? "badGradient" : "midGradient" : ""}`}>
            CCWM: {rank.ccwm.toFixed(1)}
          </h2>
        </div>
      </div>
    </Link>
  )
}