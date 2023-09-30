import { EventMatch } from '@/app/types'
import {useEffect, useState} from "react";

export default function MatchResult(
  {id, eventId, divisionId, round, instance, matchnum, field, name, blueTeams, redTeams, redScore, blueScore} : EventMatch
) {

  const [formattedMatchName, setFormattedMatchName] = useState<string>("")

  useEffect(() => {
    setFormattedMatchName(name.replace("Qualifier", "Q").replace("#", ""));
  }, [name]);

  return <>
    {eventId ? (
      <div
        className="flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center md:min-w-[150px] min-w-[55px]">
            <h2 className="text-sm font-semibold md:text-3xl text-blue-600">
              {blueTeams[0].teamNumber}
            </h2>
            <h2 className="text-sm font-semibold md:text-3xl text-blue-600">
              {blueTeams[1].teamNumber}
            </h2>
          </div>
          <div className="flex flex-col text-center justify-center md:min-w-[55px] min-w-[30px]">
            <h2 className="text-md font-semibold md:text-4xl text-blue-600">
              {blueScore > redScore ?
                <u>{blueScore}</u>
                :
                blueScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-1 text-center justify-center md:min-w-[150px] min-w-[55px]">
            <h2 className="text-sm font-semibold md:text-3xl text-GSGreen">
              {formattedMatchName}
            </h2>
            <h2 className="text-sm font-semibold md:text-3xl text-neutral-200">
              {field}
            </h2>
          </div>
          <div className="flex flex-col text-center justify-center md:min-w-[55px] min-w-[30px]">
            <h2 className="text-md font-semibold md:text-4xl text-red-600">
              {redScore > blueScore ?
                <u>{redScore}</u>
                :
                redScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-center md:min-w-[150px] min-w-[55px]">
            <h2 className="text-sm font-semibold md:text-3xl text-red-600">
              {redTeams[0].teamNumber}
            </h2>
            <h2 className="text-sm font-semibold md:text-3xl text-red-600">
              {redTeams[1].teamNumber}
            </h2>
          </div>
        </div>
      </div>
    ) : null}
    </>
}