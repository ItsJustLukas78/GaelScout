import {EventMatch, EventRankWithMetrics, TeamIdentifiers} from '@/app/types'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Link from "next/link";
import * as tf from "@tensorflow/tfjs";
import { FaRegBell } from "react-icons/fa";
import { GiNotebook } from 'react-icons/gi';
import {RelavancyType} from "@/app/types";


interface MatchResultTeamLinkProps {
  team: TeamIdentifiers;
  teamsToRelavancyType: Record<number, RelavancyType>;
}

export default function MatchResultTeamLink({ team, teamsToRelavancyType }: MatchResultTeamLinkProps) {
  console.log({teamsToRelavancyType})
  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      className={`text-xs font-semibold text-blue-500 hover:text-blue-700 sm:text-lg md:text-3xl
      ${teamsToRelavancyType[team.teamId] === RelavancyType.both ? "text-shadow shadow-gray-400" : ""}
      ${teamsToRelavancyType[team.teamId] === RelavancyType.opponent ? "text-shadow shadow-red-600" : ""}
      ${teamsToRelavancyType[team.teamId] === RelavancyType.alliance ? "text-shadow shadow-green-400" : ""}
      ${teamsToRelavancyType[team.teamId] === RelavancyType.self ? "underline" : ""}
      `}
    >
      {team.teamNumber}
    </Link>
  )
}