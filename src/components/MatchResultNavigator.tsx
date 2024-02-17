import {EventMatch, RelavancyType, TeamIdentifiers} from '@/app/types'
import { useEffect, useState } from "react";
import MatchResultTeamLink from "@/components/MatchResultTeamLink";

interface MatchResultNavigatorProps extends EventMatch {
  className?: string
  teamSetter: (team: TeamIdentifiers) => void
  teamsToRelavancyType: Record<number, RelavancyType>
}

export default function MatchResultNavigator(
  {id, eventId, divisionId, round, instance, matchnum, field, name, blueTeams, redTeams, redScore, blueScore, teamSetter, className, teamsToRelavancyType} : MatchResultNavigatorProps
) {

  const [formattedMatchName, setFormattedMatchName] = useState<string>("")

  useEffect(() => {
    if (name) {
      setFormattedMatchName(name.replace("Qualifier", "Q").replace("#", ""));
    }
  }, [name]);

  return <>
    {eventId ? (
      <div
        className={`flex h-auto w-full flex-col rounded-xl bg-neutral-700 p-2 shadow-md shadow-neutral-900 ${className}`}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center w-[55px]">
            <MatchResultTeamLink team={blueTeams[0]} mainColor="blue" teamsToRelavancyType={teamsToRelavancyType} className="text-xs" link={false} onClick={() => teamSetter(blueTeams[0])}/>
            <MatchResultTeamLink team={blueTeams[1]} mainColor="blue" teamsToRelavancyType={teamsToRelavancyType} className="text-xs" link={false} onClick={() => teamSetter(blueTeams[1])}/>
          </div>
          <div className="flex flex-col justify-center text-center w-[30px]">
            <h2 className="font-semibold text-blue-500 text-sm">
              {blueScore > redScore ?
                <u>{blueScore}</u>
                :
                blueScore
              }
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-1 text-center w-[55px]">
            <h2 className="text-2xs text-GSGreen">
              {formattedMatchName}
            </h2>
            <h2 className="text-2xs text-neutral-200 line-clamp-3">
              {field}
            </h2>
          </div>
          <div className="flex flex-col justify-center text-center w-[30px]">
            <h2 className="font-semibold text-red-500 text-sm">
              {redScore > blueScore ?
                <u>{redScore}</u>
                :
                redScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-center w-[55px]">
            <MatchResultTeamLink team={redTeams[0]} mainColor="red" teamsToRelavancyType={teamsToRelavancyType} className="text-xs" link={false} onClick={() => teamSetter(redTeams[0])}/>
            <MatchResultTeamLink team={redTeams[1]} mainColor="red" teamsToRelavancyType={teamsToRelavancyType} className="text-xs" link={false} onClick={() => teamSetter(redTeams[1])}/>
          </div>
        </div>
      </div>
    ) : null}
  </>
}