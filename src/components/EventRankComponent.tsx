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
      className="flex h-auto w-full flex-col items-center rounded-xl bgColorSecondary p-2 px-3 shadow-md shadow-neutral-900 transition-colors duration-200 hover:bgColorSecondaryHover"
    >
      <div className="flex w-full flex-row">
        <h1 className="mb-2 text-sm font-medium md:text-2xl outlinedText">
          <span className="font-extrabold">{team.teamNumber}</span> - {team.teamName}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-bold text-2xs md:text-sm outlinedText">
            Rank: {rank.rank}
          </h2>
          <h2 className="ml-auto font-bold text-2xs md:text-sm outlinedText">
            WP: {rank.wp}
          </h2>
          <h2 className="ml-3 font-bold text-2xs md:text-sm outlinedText">
            AP: {rank.ap}
          </h2>
          <h2 className="ml-auto font-bold text-2xs md:text-sm outlinedText">
            SP: {rank.sp}
          </h2>
        </div>
        <div className="flex flex-row w-full [&>*]:w-1/4">
          <h2 className="font-bold text-2xs md:text-sm outlinedText">
            {`${rank.wins}-${rank.losses}-${rank.ties}`}
          </h2>
          <h2 className={`ml-auto font-bold text-2xs md:text-sm outlinedText ${rank.opr ? rank.opr > statBrackets.upperOPR ? "goodGradient" : rank.opr < statBrackets.middleOPR ? "badGradient" : "midGradient" : ""}`}>
            OPR:{rank.opr.toFixed(1)}
          </h2>
          <h2 className={`ml-3 font-bold text-2xs md:text-sm outlinedText ${rank.dpr ? rank.dpr < statBrackets.upperDPR ? "goodGradient" : rank.dpr > statBrackets.middleDPR ? "badGradient" : "midGradient" : ""}`}>
            DPR: {rank.dpr.toFixed(1)}
          </h2>
          <h2 className={`ml-auto font-bold text-2xs md:text-sm outlinedText ${rank.ccwm ? rank.ccwm > statBrackets.upperCCWM ? "goodGradient" : rank.ccwm < statBrackets.middleCCWM ? "badGradient" : "midGradient" : ""}`}>
            CCWM: {rank.ccwm.toFixed(1)}
          </h2>
        </div>
      </div>
    </Link>
  )
}