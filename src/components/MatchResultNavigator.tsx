import { EventMatch, TeamIdentifiers } from '@/app/types'
import { useEffect, useState } from "react";

// props interface

interface MatchResultNavigatorProps extends EventMatch {
  className?: string
  teamSetter: (team: TeamIdentifiers) => void
}

export default function MatchResultNavigator(
  {id, eventId, divisionId, round, instance, matchnum, field, name, blueTeams, redTeams, redScore, blueScore, teamSetter, className} : MatchResultNavigatorProps
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
        className={`flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28 ${className}`}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <button
              className="text-sm font-semibold text-blue-600 hover:text-blue-400 md:text-3xl"
              onClick={() => teamSetter(blueTeams[0])}
            >
              {blueTeams[0].teamNumber}
            </button>
            <button
              className="text-sm font-semibold text-blue-600 hover:text-blue-400 md:text-3xl"
              onClick={() => teamSetter(blueTeams[1])}
            >
              {blueTeams[1].teamNumber}
            </button>
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="font-semibold text-blue-600 text-md md:text-4xl">
              {blueScore > redScore ?
                <u>{blueScore}</u>
                :
                blueScore
              }
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-1 text-center min-w-[55px] md:min-w-[150px]">
            <h2 className="text-sm font-semibold text-GSGreen md:text-3xl">
              {formattedMatchName}
            </h2>
            <h2 className="text-sm font-semibold text-neutral-200 md:text-3xl">
              {field}
            </h2>
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="font-semibold text-red-600 text-md md:text-4xl">
              {redScore > blueScore ?
                <u>{redScore}</u>
                :
                redScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <button
              className="text-sm font-semibold text-red-600 hover:text-red-400 md:text-3xl"
              onClick={() => teamSetter(redTeams[0])}
            >
              {redTeams[0].teamNumber}
            </button>
            <button
              className="text-sm font-semibold text-red-600 hover:text-red-400 md:text-3xl"
              onClick={() => teamSetter(redTeams[1])}
            >
              {redTeams[1].teamNumber}
            </button>
          </div>
        </div>
      </div>
    ) : null}
  </>
}