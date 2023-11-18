import {EventMatch, EventRankWithMetrics} from '@/app/types'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Link from "next/link";
import * as tf from "@tensorflow/tfjs";

interface MatchResultProps {
  eventMatch: EventMatch
  seasonId: number
  worldModel: any
  eventModel: any
  eventRankings: EventRankWithMetrics[]
}

enum ModelType {
  'worldModel' = 'worldModel',
  'eventModel' = 'eventModel'
}

export default function MatchResult({
  eventMatch: {
    id,
    eventId,
    started,
    scheduled,
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
  seasonId,
  worldModel,
  eventModel,
  eventRankings
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
      const redChance = prediction.rChance;
      const blueChance = prediction.bChance;

      setRedWins(redChance >= blueChance);
      setRedWinPercentage(redChance);

      setBlueWins(blueChance >= redChance);
      setBlueWinPercentage(blueChance);
    }
  }, [prediction]);

  const predictMatch = async(event: any, usedModel: ModelType) => {
    event.preventDefault();

    if (usedModel === ModelType.worldModel) {
      toast.info("Predicting match using world stats...");
    } else if (usedModel === ModelType.eventModel) {
      toast.info("Predicting match using event stats...");
    }

    const r1Team = redTeams[0].teamNumber;
    const r2Team = redTeams[1].teamNumber;

    const b1Team = blueTeams[0].teamNumber;
    const b2Team = blueTeams[1].teamNumber;

    const searchParams = new URLSearchParams();

    searchParams.append('teamNumber[]', r1Team.toUpperCase());
    searchParams.append('teamNumber[]', r2Team.toUpperCase());
    searchParams.append('teamNumber[]', b1Team.toUpperCase());
    searchParams.append('teamNumber[]', b2Team.toUpperCase());

    try {
      const response = await fetch(`/api/seasons/${seasonId}/seasonProfiles/?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const teams = data.data;

      let r1TeamData: any = null;
      let r2TeamData: any = null;
      let b1TeamData: any = null;
      let b2TeamData: any = null;

      if (usedModel === ModelType.worldModel) {
        r1TeamData = teams.find((team: any) => team.teamNumber === r1Team.toUpperCase());
        r2TeamData = teams.find((team: any) => team.teamNumber === r2Team.toUpperCase());
        b1TeamData = teams.find((team: any) => team.teamNumber === b1Team.toUpperCase());
        b2TeamData = teams.find((team: any) => team.teamNumber === b2Team.toUpperCase());

        if (!r1TeamData || !r2TeamData || !b1TeamData || !b2TeamData) {
          toast.error("One of the teams have not been added to the world model yet");
          return;
        }
      } else if (usedModel === ModelType.eventModel) {
        r1TeamData = eventRankings.find((team: any) => team.team.teamNumber === r1Team.toUpperCase());
        r2TeamData = eventRankings.find((team: any) => team.team.teamNumber === r2Team.toUpperCase());
        b1TeamData = eventRankings.find((team: any) => team.team.teamNumber === b1Team.toUpperCase());
        b2TeamData = eventRankings.find((team: any) => team.team.teamNumber === b2Team.toUpperCase());

        if (!r1TeamData || !r2TeamData || !b1TeamData || !b2TeamData) {
          toast.error("Metrics for one of the teams could not be found");
          return;
        }
      } else {
        toast.error("Invalid model type");
        return;
      }

      let red_opr = 0;
      let red_dpr = 0;
      let red_ccwm = 0;
      let blue_opr = 0;
      let blue_dpr = 0;
      let blue_ccwm = 0;

      let red_openSkill = 0;
      let blue_openSkill = 0;

      red_opr = r1TeamData.opr + r2TeamData.opr
      red_dpr = r1TeamData.dpr + r2TeamData.dpr
      red_ccwm = r1TeamData.ccwm + r2TeamData.ccwm

      blue_opr = b1TeamData.opr + b2TeamData.opr
      blue_dpr = b1TeamData.dpr + b2TeamData.dpr
      blue_ccwm = b1TeamData.ccwm + b2TeamData.ccwm

      if (usedModel === ModelType.worldModel) {
        red_openSkill = Math.round((r1TeamData.openSkill + r2TeamData.openSkill) * 10000) / 10000;
        blue_openSkill = Math.round((b1TeamData.openSkill + b2TeamData.openSkill) * 10000) / 10000;
      }

      let predictedValue: number = 0;

      if (usedModel === ModelType.worldModel) {
        const resultTensor: any = worldModel.predict(tf.tensor2d([red_opr, red_dpr, red_ccwm, red_openSkill, blue_opr, blue_dpr, blue_ccwm, blue_openSkill], [1, 8]));
        predictedValue = resultTensor.arraySync()[0][0];
      } else if (usedModel === ModelType.eventModel) {
        const resultTensor: any = eventModel.predict(tf.tensor2d([red_opr, red_dpr, red_ccwm, blue_opr, blue_dpr, blue_ccwm], [1, 6]));
        predictedValue = resultTensor.arraySync()[0][0];
      }

      predictedValue = Math.round(predictedValue * 100);

      let rChance = 0;
      let bChance = 0;

      rChance = predictedValue
      bChance = 100 - predictedValue

      setPrediction({
        rChance,
        bChance
      });

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
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 md:text-3xl"
            >
              {blueTeams[0].teamNumber}
            </Link>
            <Link
              href={`/teams/${blueTeams[1].teamNumber}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 md:text-3xl"
            >
              {blueTeams[1].teamNumber}
            </Link>
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="text-sm font-medium text-blue-600 md:text-4xl">
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
            <h2 className="text-sm font-medium text-red-600 md:text-4xl">
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
              className="text-xs font-semibold text-red-600 hover:text-red-700 md:text-3xl"
            >
              {redTeams[0].teamNumber}
            </Link>
            <Link
              href={`/teams/${redTeams[1].teamNumber}`}
              className="text-xs font-semibold text-red-600 hover:text-red-700 md:text-3xl"
            >
              {redTeams[1].teamNumber}
            </Link>
          </div>
        </div>
        <div className="mt-1 flex flex-row justify-between gap-2 sm:justify-center">
          {/*two colored lines indicating predicted winner*/}
          {prediction ? <>
            <div className={`flex flex-row w-[47%] text-xs lg:text-md justify-center rounded-2xl text-black font-medium ${blueWins ? "bg-GSGreen" : "bg-gray-600"}`}>
              {blueWins ? `Predicted ${Math.abs(blueWinPercentage)}%` : null}
            </div>
            <div className={`flex flex-row w-[47%] text-xs lg:text-md justify-center rounded-2xl text-black font-medium ${redWins ? "bg-GSGreen" : "bg-gray-600"}`}>
              {redWins ? `Predicted ${Math.abs(redWinPercentage)}%` : null}
            </div>
          </> : <>
            <button
              className="ml-auto flex flex-row justify-center rounded-2xl font-medium text-black shadow-md transition-colors duration-200 p-0.5 w-[47%] text-2xs bg-GSGreen hover:bg-GSGreenDark sm:w-28 sm:p-1 lg:text-md lg:w-48"
              onClick={(event) => predictMatch(event, ModelType.worldModel)}
            >
              Predict (World)
            </button>
            <button
              className="mr-auto flex flex-row justify-center rounded-2xl font-medium text-black shadow-md transition-colors duration-200 p-0.5 w-[47%] text-2xs bg-GSGreen hover:bg-GSGreenDark sm:w-28 sm:p-1 lg:text-md lg:w-48"
              onClick={(event) => predictMatch(event, ModelType.eventModel)}
            >
              Predict (Event)
            </button>
          </>}
        </div>
      </div>
    ) : null}
    </>
}