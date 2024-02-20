import {EventAward, TeamProfile} from '@/app/types'
import Link from "next/link";
import { GiDiamondTrophy } from "react-icons/gi";
import {FaLightbulb, FaTrophy} from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import {MdCelebration, MdEngineering, MdSupervisorAccount} from "react-icons/md";
import { TbNotebook } from "react-icons/tb";
import { FaLaptopCode } from "react-icons/fa";
import { TbNumbers } from "react-icons/tb";
import { BiCool } from "react-icons/bi";
import { MdBuild } from "react-icons/md";

import React from "react";

const awardIcons = {
  "Excellence Award": <GiDiamondTrophy className="w-10 h-10 mt-1" />,
  "Tournament Champions": <FaTrophy className="w-10 h-10 mt-1" />,
  "Design Award": <TbNotebook className="w-10 h-10 mt-1" />,
  "Judges Award": <MdSupervisorAccount className="w-10 h-10 mt-1" />,
  "Skills Champion": <TbNumbers className="w-10 h-10 mt-1" />,
  "Think Award": <FaLaptopCode className="w-10 h-10 mt-1" />,
  "Amaze Award": <BiCool className="w-10 h-10 mt-1" />,
  "Build Award": <MdBuild className="w-10 h-10 mt-1" />,
  "Create Award": <MdEngineering className="w-10 h-10 mt-1" />,
  "Innovate Award": <FaLightbulb className="w-10 h-10 mt-1" />,
  "Sportsmanship Award": <MdCelebration className="w-10 h-10 mt-1" />,
};

interface AwardResultProps {
  award: EventAward,
  team: TeamProfile
}

export default function AwardResult(
  { award: {id, eventId, eventName, divisionId, name, qualification, team: teamIdentifiers, order}, team } : AwardResultProps
)
{

  const returnAwardIcon = (awardName: string) => {
    let icon = <FaAward className="w-10 h-10 mt-1" />;

    Object.keys(awardIcons).forEach((key: any) => {
      if (awardName.startsWith(key)) {
        // @ts-ignore
        icon = awardIcons[key];
      }
    });

    return icon;
  }


  return (
    <Link
      href={`/teams/${team.teamNumber}`}
      key={`award-${id + order}`}
      className="flex h-auto w-full flex-row rounded-2xl bgColorSecondary p-3 gap-4 shadow-lg shadow-neutral-900 transition-colors duration-200 min-h-28 hover:bgColorSecondaryHover"
    >
      <div className="flex flex-col gap-2 outlinedText">
        {returnAwardIcon(name)}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="mb-2 text-sm font-semibold md:text-lg outlinedText">
          {name}
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium md:text-sm outlinedText">
            Winner: {team.teamNumber} - {team.teamName}
          </h2>
          <h2 className="text-xs font-medium md:text-sm outlinedText">
            Qualifications: {qualification ?? 'N/A'}
          </h2>
        </div>
      </div>
    </Link>
  )
}