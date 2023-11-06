import { EventMatch } from '@/app/types'
import {useEffect, useState} from "react";

export default function MatchResult(
  {id, eventId, started, divisionId, round, instance, matchnum, field, name, blueTeams, redTeams, redScore, blueScore} : EventMatch
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
        className="flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <h2 className="text-sm font-semibold text-blue-600 md:text-3xl">
              {blueTeams[0].teamNumber}
            </h2>
            <h2 className="text-sm font-semibold text-blue-600 md:text-3xl">
              {blueTeams[1].teamNumber}
            </h2>
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
            <h2 className="text-sm font-semibold text-red-600 md:text-3xl">
              {redTeams[0].teamNumber}
            </h2>
            <h2 className="text-sm font-semibold text-red-600 md:text-3xl">
              {redTeams[1].teamNumber}
            </h2>
          </div>
        </div>
      </div>
    ) : null}
    </>
}