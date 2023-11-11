import { EventMatch } from '@/app/types'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Link from "next/link";

interface MatchResultProps {
  eventMatch: EventMatch
  seasonId: number
}

export default function MatchResult({
  eventMatch: {
    id,
    eventId,
    started,
    divisionId,
    round,
    instance,
    matchnum,
    field,
    name,
    blueTeams,
    redTeams,
    redScore,
    blueScore
  },
  seasonId
} : MatchResultProps
) {

  const [formattedMatchName, setFormattedMatchName] = useState<string>("")

  useEffect(() => {
    if (name) {
      setFormattedMatchName(name.replace("Qualifier", "Q").replace("#", ""));
    }
  }, [name]);

  const [prediction, setPrediction] = useState<any>(null);

  const [redWins, setRedWins] = useState<boolean>(false);
  const [redWinPercentage, setRedWinPercentage] = useState<number>(0);
  const [blueWins, setBlueWins] = useState<boolean>(false);
  const [blueWinPercentage, setBlueWinPercentage] = useState<number>(0);

  useEffect(() => {
    if (prediction) {
      const redChance = prediction.rChance2;
      const blueChance = prediction.bChance2;

      setRedWins(redChance > blueChance);
      setRedWinPercentage(redChance);

      setBlueWins(blueChance > redChance);
      setBlueWinPercentage(blueChance);
    }
  }, [prediction]);

  const predictMatch = async(event: any) => {
    event.preventDefault();

    const r1Team = redTeams[0].teamNumber;
    const r2Team = redTeams[1].teamNumber;

    const b1Team = blueTeams[0].teamNumber;
    const b2Team = blueTeams[1].teamNumber;

    toast.info("Predicting match...");

    const searchParams = new URLSearchParams();

    searchParams.append('r1Team', r1Team.toUpperCase());
    searchParams.append('r2Team', r2Team.toUpperCase());
    searchParams.append('b1Team', b1Team.toUpperCase());
    searchParams.append('b2Team', b2Team.toUpperCase());
    searchParams.append('seasonId', String(seasonId));

    try {
      const response = await fetch(`/api/predict?${searchParams.toString()}`);

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }
      setPrediction(data);
    } catch (err) {
      console.log(err);
    }
  }

  return <>
    {eventId ? (
      <div
        className="flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <Link
              href={`/teams/${blueTeams[0].teamNumber}`}
              className="text-xs font-semibold text-blue-600 md:text-3xl hover:text-blue-700"
            >
              {blueTeams[0].teamNumber}
            </Link>
            <Link
              href={`/teams/${blueTeams[1].teamNumber}`}
              className="text-xs font-semibold text-blue-600 md:text-3xl hover:text-blue-700"
            >
              {blueTeams[1].teamNumber}
            </Link>
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="font-medium text-blue-600 text-sm md:text-4xl">
              {blueScore > redScore ?
                <u className="font-bold">{blueScore}</u>
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
            <h2 className="font-medium text-red-600 text-sm md:text-4xl">
              {redScore > blueScore ?
                <u className="font-bold">{redScore}</u>
                :
                redScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <Link
              href={`/teams/${redTeams[0].teamNumber}`}
              className="text-xs font-semibold text-red-600 md:text-3xl hover:text-red-700"
            >
              {redTeams[0].teamNumber}
            </Link>
            <Link
              href={`/teams/${redTeams[1].teamNumber}`}
              className="text-xs font-semibold text-red-600 md:text-3xl hover:text-red-700"
            >
              {redTeams[1].teamNumber}
            </Link>
          </div>
        </div>
        <div className="mt-1 flex flex-row justify-between">
          {/*two colored lines indicating predicted winner*/}
          {prediction ? <>
            <div className={`flex flex-row w-[47%] text-xs lg:text-md justify-center rounded-2xl text-black font-medium ${blueWins ? "bg-GSGreen" : "bg-gray-600"}`}>
              {blueWins ? `Predicted ${Math.abs(blueWinPercentage)}%` : null}
            </div>
            <div className={`flex flex-row w-[47%] text-xs lg:text-md justify-center rounded-2xl text-black font-medium ${redWins ? "bg-GSGreen" : "bg-gray-600"}`}>
              {redWins ? `Predicted ${Math.abs(redWinPercentage)}%` : null}
            </div>
          </> : (
            <button
              className="mx-auto flex flex-row w-[47%] sm:w-28 lg:w-48 text-xs lg:text-md justify-center rounded-2xl text-black font-medium bg-GSGreen transition-colors duration-200 hover:bg-GSGreenDark shadow-md"
              onClick={predictMatch}
            >
              Predict Match
            </button>
          )}
        </div>
      </div>
    ) : null}
    </>
}