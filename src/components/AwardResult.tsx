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
  "Excellence Award": <GiDiamondTrophy className="mt-1 h-10 w-10" />,
  "Tournament Champions": <FaTrophy className="mt-1 h-10 w-10" />,
  "Design Award": <TbNotebook className="mt-1 h-10 w-10" />,
  "Judges Award": <MdSupervisorAccount className="mt-1 h-10 w-10" />,
  "Skills Champion": <TbNumbers className="mt-1 h-10 w-10" />,
  "Think Award": <FaLaptopCode className="mt-1 h-10 w-10" />,
  "Amaze Award": <BiCool className="mt-1 h-10 w-10" />,
  "Build Award": <MdBuild className="mt-1 h-10 w-10" />,
  "Create Award": <MdEngineering className="mt-1 h-10 w-10" />,
  "Innovate Award": <FaLightbulb className="mt-1 h-10 w-10" />,
  "Sportsmanship Award": <MdCelebration className="mt-1 h-10 w-10" />,
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
    let icon = <FaAward className="mt-1 h-10 w-10" />;

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
      className="flex h-auto w-full flex-row gap-4 rounded-2xl p-3 shadow-lg shadow-neutral-900 transition-colors duration-200 bgColorSecondary min-h-28 hover:bgColorSecondaryHover"
    >
      <div className="flex flex-col gap-2 outlinedText">
        {returnAwardIcon(name)}
      </div>
      <div className="flex flex-col gap-2 max-w-[85%]">
        <h1 className="mb-2 text-sm font-semibold outlinedText md:text-lg">
          {name}
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium outlinedText line-clamp-2 md:text-sm">
            Winner: {team.teamNumber} - {team.teamName}
          </h2>
          <h2 className="text-xs font-medium outlinedText md:text-sm">
            Qualifications: {qualification ?? 'N/A'}
          </h2>
        </div>
      </div>
    </Link>
  )
}