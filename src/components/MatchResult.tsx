import {EventMatch, EventRankWithMetrics} from '@/app/types'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Link from "next/link";
import * as tf from "@tensorflow/tfjs";
import { FaRegBell } from "react-icons/fa";
import { GiNotebook } from 'react-icons/gi';
import {RelavancyType} from "@/app/types";
import MatchResultTeamLink from "@/components/MatchResultTeamLink";


interface MatchResultProps {
  eventMatch: EventMatch
  seasonId: number
  worldModel: any
  eventModel: any
  eventRankings: EventRankWithMetrics[],
  teamsToRelavancyType: Record<number, RelavancyType>,
  openMatchNotes: (teamId: number) => void
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
  eventRankings,
  teamsToRelavancyType,
  openMatchNotes
} : MatchResultProps
) {

  const [formattedMatchName, setFormattedMatchName] = useState<string>("")

  useEffect(() => {
    if (name) {
      setFormattedMatchName(name.replace("Qualifier", "Q").replace("#", ""));
    }
  }, [name]);

  const [worldPrediction, setWorldPrediction] = useState<any>(null);
  const [eventPrediction, setEventPrediction] = useState<any>(null);

  const [redWinsWorld, setRedWinsWorld] = useState<boolean>(false);
  const [redWinPercentageWorld, setRedWinPercentageWorld] = useState<number>(0);
  const [blueWinsWorld, setBlueWinsWorld] = useState<boolean>(false);
  const [blueWinPercentageWorld, setBlueWinPercentageWorld] = useState<number>(0);

  const [redWinsEvent, setRedWinsEvent] = useState<boolean>(false);
  const [redWinPercentageEvent, setRedWinPercentageEvent] = useState<number>(0);
  const [blueWinsEvent, setBlueWinsEvent] = useState<boolean>(false);
  const [blueWinPercentageEvent, setBlueWinPercentageEvent] = useState<number>(0);

  useEffect(() => {
    if (worldPrediction) {
      const redChance = worldPrediction.rChance;
      const blueChance = worldPrediction.bChance;

      setRedWinsWorld(redChance >= blueChance);
      setRedWinPercentageWorld(redChance);

      setBlueWinsWorld(blueChance >= redChance);
      setBlueWinPercentageWorld(blueChance);
    }
  }, [worldPrediction])

  useEffect(() => {
    if (eventPrediction) {
      const redChance = eventPrediction.rChance;
      const blueChance = eventPrediction.bChance;

      setRedWinsEvent(redChance >= blueChance);
      setRedWinPercentageEvent(redChance);

      setBlueWinsEvent(blueChance >= redChance);
      setBlueWinPercentageEvent(blueChance);
    }
  }, [eventPrediction])

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
          toast.error("One of the teams have not competed before");
          return;
        }
      } else if (usedModel === ModelType.eventModel) {
        r1TeamData = eventRankings.find((team: any) => team.team.teamNumber === r1Team.toUpperCase());
        r2TeamData = eventRankings.find((team: any) => team.team.teamNumber === r2Team.toUpperCase());
        b1TeamData = eventRankings.find((team: any) => team.team.teamNumber === b1Team.toUpperCase());
        b2TeamData = eventRankings.find((team: any) => team.team.teamNumber === b2Team.toUpperCase());

        if (!r1TeamData || !r2TeamData || !b1TeamData || !b2TeamData) {
          toast.error("Event metrics for one of the teams could not be found");
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

      if (usedModel === ModelType.worldModel) {
        setWorldPrediction({
          rChance,
          bChance
        });
      } else if (usedModel === ModelType.eventModel) {
        setEventPrediction({
          rChance,
          bChance
        });
      }

    } catch (err) {
      console.log(err);
    }
  }

  const requestNotification = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      console.log("Permission to send notifications has been granted");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Permission to send notifications has been granted");
        }
      });
    }

    if (navigator.serviceWorker.controller) {
      const eventMatch = {
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
      }

      navigator.serviceWorker.controller.postMessage({ type: "push", event: eventMatch, numberOfEventsBefore: 4 });

      toast.success("Notification set for " + formattedMatchName + "! Previously set notifications will be overwritten.");
    }
  }

  return <>
    {eventId ? (
      <div
        className="flex h-auto w-full flex-col rounded-2xl bg-neutral-700 p-3 shadow-md shadow-neutral-900 min-h-28"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <MatchResultTeamLink team={blueTeams[0]} teamsToRelavancyType={teamsToRelavancyType} />
            <MatchResultTeamLink team={blueTeams[1]} teamsToRelavancyType={teamsToRelavancyType} />
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="text-sm font-medium text-blue-500 sm:text3xl sm:text-xl md:text-4xl">
              {blueScore > redScore ?
                <u className="font-bold">{blueScore}</u>
                :
                blueScore
              }
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-1 text-center min-w-[55px] md:min-w-[150px]">
            <h2 className="text-sm font-semibold text-GSGreen sm:text-lg md:text-3xl">
              {formattedMatchName}
            </h2>
            <h2 className="text-xs font-semibold text-neutral-200 sm:text-md md:text-2xl">
              {field}
            </h2>
          </div>
          <div className="flex flex-col justify-center text-center min-w-[30px] md:min-w-[55px]">
            <h2 className="text-sm font-medium text-red-500 sm:text-xl md:text-4xl">
              {redScore > blueScore ?
                <u className="font-bold">{redScore}</u>
                :
                redScore
              }
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-center min-w-[55px] md:min-w-[150px]">
            <MatchResultTeamLink team={redTeams[0]} teamsToRelavancyType={teamsToRelavancyType} />
            <MatchResultTeamLink team={redTeams[1]} teamsToRelavancyType={teamsToRelavancyType} />
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2 w-full">
          <button
            className="flex justify-center items-center ml-2 lg:ml-8 text-white text-2xs hover:text-gray-400 transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              requestNotification();
            }}
          >
            <FaRegBell className="sm:h-6 sm:w-6 h-4 w-4 mt-2" />
          </button>
          <div className="mt-1 flex flex-col gap-2 justify-center items-center w-[85%]">
            {worldPrediction ? <>
              <div className="flex flex-row justify-center gap-2 w-full">
                <div className={`flex flex-row w-[47%] text-2xs lg:text-md justify-center rounded-2xl text-black font-medium sm:p-0.5 ${blueWinsWorld ? "bg-green-500" : "bg-gray-600"}`}>
                  {blueWinsWorld ? `Predicted ${Math.abs(blueWinPercentageWorld)}%` : null}
                </div>
                <div className={`flex flex-row w-[47%] text-2xs lg:text-md justify-center rounded-2xl text-black font-medium sm:p-0.5 ${redWinsWorld ? "bg-green-500" : "bg-gray-600"}`}>
                  {redWinsWorld ? `Predicted ${Math.abs(redWinPercentageWorld)}%` : null}
                </div>
              </div>
            </> : <>
              <button
                className="flex flex-row justify-center rounded-2xl font-medium text-black shadow-md transition-colors duration-200 w-[75%] text-2xs bg-green-500 hover:bg-green-600 sm:w-44 sm:p-0.5 lg:text-md lg:w-64"
                onClick={(event) => predictMatch(event, ModelType.worldModel)}
              >
                Predict (World)
              </button>
            </>
            }
            {eventPrediction ? <>
              <div className="flex flex-row justify-center gap-2 w-full">
                <div className={`flex flex-row w-[47%] text-2xs lg:text-md justify-center rounded-2xl text-black font-medium sm:p-0.5 ${blueWinsEvent ? "bg-green-500" : "bg-gray-600"}`}>
                  {blueWinsEvent ? `Predicted ${Math.abs(blueWinPercentageEvent)}%` : null}
                </div>
                <div className={`flex flex-row w-[47%] text-2xs lg:text-md justify-center rounded-2xl text-black font-medium sm:p-0.5 ${redWinsEvent ? "bg-green-500" : "bg-gray-600"}`}>
                  {redWinsEvent ? `Predicted ${Math.abs(redWinPercentageEvent)}%` : null}
                </div>
              </div>
              </> : <>
              <button
                className="flex flex-row justify-center rounded-2xl font-medium text-black shadow-md transition-colors duration-200 w-[75%] text-2xs bg-green-500 hover:green-600 sm:w-44 sm:p-0.5 lg:text-md lg:w-64"
                onClick={(event) => predictMatch(event, ModelType.eventModel)}
              >
                Predict (Event)
              </button>
            </>
            }
          </div>
          <button
            className="flex justify-center items-center mr-2 lg:mr-8 text-white text-2xs hover:text-gray-400 transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              openMatchNotes(id);
            }}
          >
            <GiNotebook className="sm:h-6 sm:w-6 h-4 w-4 mt-2" />
          </button>
        </div>
      </div>
    ) : null}
    </>
}