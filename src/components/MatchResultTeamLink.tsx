import {TeamIdentifiers} from '@/app/types'
import Link from "next/link";
import {RelavancyType} from "@/app/types";
import { FaHandshakeSimple } from "react-icons/fa6";
import { LuSwords } from "react-icons/lu";



interface MatchResultTeamLinkProps {
  team: TeamIdentifiers;
  mainColor: "red" | "blue";
  teamsToRelavancyType: Record<number, RelavancyType>;
}

export default function MatchResultTeamLink({ team, mainColor, teamsToRelavancyType }: MatchResultTeamLinkProps) {
  console.log({teamsToRelavancyType})
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className={`text-xs ${mainColor === "red" ? "text-red-500 hover:text-red-700" : "text-blue-500 hover:text-blue-700"} sm:text-lg md:text-3xl
      ${teamsToRelavancyType[team.teamId] === RelavancyType.self ? "underline" : ""}`
      }
    >
      {team.teamNumber}
      <span className="ml-1 text-2xs sm:text-sm md:text-xl text-GSGreen">
        {teamsToRelavancyType[team.teamId] === RelavancyType.opponent ? <LuSwords /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.alliance ? <FaHandshakeSimple /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.both ? <><LuSwords /> <FaHandshakeSimple /></> : null}
      </span>
    </Link>
  )
}