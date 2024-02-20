import {TeamIdentifiers} from '@/app/types'
import Link from "next/link";
import {RelavancyType} from "@/app/types";
import { FaHandshakeSimple } from "react-icons/fa6";
import { LuSwords } from "react-icons/lu";



interface MatchResultTeamLinkProps {
  team: TeamIdentifiers;
  mainColor: "red" | "blue";
  teamsToRelavancyType: Record<number, RelavancyType>;
  link?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function MatchResultTeamLink({ team, mainColor, teamsToRelavancyType, link = true, className, onClick }: MatchResultTeamLinkProps) {
  return (
    link ?
    <Link
      href={`/teams/${team.teamNumber}`}
      className={`${mainColor === "red" ? "text-red-500 hover:text-red-700" : "text-blue-500 hover:text-blue-700"} 
      ${className ? className : "text-xs font-bold sm:text-lg"}
      ${teamsToRelavancyType[team.teamId] === RelavancyType.self ? "underline" : ""}
      outlinedText
      `
      }
    >
      {team.teamNumber}
      <span className="ml-1 text-2xs sm:text-sm text-GSGreen">
        {teamsToRelavancyType[team.teamId] === RelavancyType.opponent ? <LuSwords /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.alliance ? <FaHandshakeSimple /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.both ? <><LuSwords /> <FaHandshakeSimple /></> : null}
      </span>
    </Link>
    :
    <button
      className={`${mainColor === "red" ? "text-red-500" : "text-blue-500"} 
      ${className ? className : "text-xs font-bold"}
      ${teamsToRelavancyType[team.teamId] === RelavancyType.self ? "underline" : ""}
      flex text-center justify-center items-center h-[49%] outlinedText
      `
      }
      onClick={onClick}
    >
      {team.teamNumber}
      <span className="ml-1 text-2xs text-GSGreen">
        {teamsToRelavancyType[team.teamId] === RelavancyType.opponent ? <LuSwords /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.alliance ? <FaHandshakeSimple /> : null}
        {teamsToRelavancyType[team.teamId] === RelavancyType.both ? <><LuSwords /> <FaHandshakeSimple /></> : null}
      </span>
    </button>
  )
}