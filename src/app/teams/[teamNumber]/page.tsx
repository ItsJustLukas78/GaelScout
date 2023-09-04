"use client"
import React, {useEffect, useState} from "react";
import * as Form from "@radix-ui/react-form/dist";
import CorneredButton from "@/components/CorneredButton";
import TeamResultSkeleton from "@/components/TeamResultSkeleton";
import {AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {toast} from "react-toastify";

interface TeamProfile {
  teamId: number,
  teamName: string,
  teamNumber: string,
  robotName: string,
  teamGrade: string,
  teamOrg: string,
  teamCity: string,
  teamRegion: string,
  teamCountry: string,
  programCode: string,
  programId: number,
}

export default function TeamProfile({ params }: { params: { teamNumber: string } }) {
  const teamNumber = params.teamNumber

  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [seasonStats, setSeasonStats] = useState< any >(null);
  const [seasonId, setSeasonId] = useState< number >(173);

  const getTeam = () => {
    fetch(`/api/teams/${teamNumber.toUpperCase()}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error)
        }
        setTeamProfile(data)
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  const getSeasonStats = () => {
    fetch(`/api/seasons/${seasonId}/team/${teamNumber.toUpperCase()}`).then((response) => {
      response.json().then((data) => {
        if (data?.error) {
          setSeasonStats(null);
          return;
        }
        setSeasonStats(data);
      });
    }).catch((error) => {
      console.log(error);
      setSeasonStats(null);
    });
  }

  useEffect(() => {
    getTeam();
  }, []);

  useEffect(() => {
    getSeasonStats();
  }, [seasonId]);

  return (
    <main>
      <div className="w-full items-center justify-center flex flex-col my-44 gap-16">
        {teamProfile ? <>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <h1 className="lg:text-8xl md:text-5xl sm:text-8xl xs:text-5xl text-5xl font-bold mb-10 min-w-fit">
              Team #{teamProfile.teamNumber}
            </h1>
            <div className="md:gap-14 gap-5 flex md:flex-row flex-col min-w-auto">
              <div className="gap-5 flex md:flex-col flex-row min-w-fit">
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Team Name:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamName ? teamProfile.teamName : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Robot Name:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.robotName ? teamProfile.robotName : "N/A"}
                  </h3>
                </div>
              </div>
              <div className="gap-5 flex md:flex-col flex-row min-w-fit">
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Organization:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamOrg ? teamProfile.teamOrg : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Location:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamCity ? teamProfile.teamCity + ", " : ""}{teamProfile ? teamProfile.teamRegion + ", " : ""}{teamProfile ? teamProfile.teamCountry : ""}
                  </h3>
                </div>
              </div>
              <div className="gap-5 flex md:flex-col flex-row min-w-fit">
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Program:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.programCode ? teamProfile.programCode : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col md:w-auto w-[49%]">
                  <h3 className="text-xl font-bold">
                    Grade:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamGrade ? teamProfile.teamGrade : "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <div className="flex md:flex-row flex-col justify-between mb-10">
              <h3 className="lg:text-5xl md:text-3xl xs:text-5xl text-3xl font-bold min-w-fit md:mb-0 mb-5">
                Season Statistics
              </h3>
              <select
                className="p-3 h-12 text-black rounded-lg lg:w-80 sm:w-52 w-48"
                required
                value={seasonId}
                onChange={(event) => setSeasonId(parseInt(event.target.value))}
              >
                <option value="173">Spin Up 2022-2023</option>
                <option value="181">Over Under 2023-2024</option>
              </select>
            </div>
            {seasonStats ? <>
              <div className="mx-2 flex flex-row gap-5 flex-wrap md:justify-between justify-center">
                <div className="flex flex-col gap-5 xl:w-[49%] md:w-[47%] w-full bg-neutral-700 p-3 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      OPR:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.opr != undefined ? seasonStats.opr.toFixed(4) : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      DPR:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.dpr != undefined ? seasonStats.dpr.toFixed(4) : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      CCWM:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.ccwm != undefined ? seasonStats.ccwm.toFixed(4) : "N/A"}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-5 xl:w-[49%] md:w-[47%] w-full bg-neutral-700 p-3 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      OpenSkill:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.openSkill != undefined ? seasonStats.openSkill.toFixed(4) : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      OpenSkill Rank:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.openSkillRank != undefined ? seasonStats.openSkillRank : "N/A"}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-5 xl:w-[49%] md:w-[47%] w-full bg-neutral-700 p-3 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Qual Win:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.qualMatchWinPercentage != undefined ? `${seasonStats.qualMatchWinPercentage.toFixed(2)}%` : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Elim Win:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.elimMatchWinPercentage != undefined ? `${seasonStats.elimMatchWinPercentage.toFixed(2)}%` : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Event Count:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.eventCount != undefined ? seasonStats.eventCount : "N/A"}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-5 xl:w-[49%] md:w-[47%] w-full bg-neutral-700 p-3 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Skills:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.topTotalSkills != undefined ? seasonStats.topTotalSkills : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Skills Rank:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.skillsRank != undefined ? seasonStats.skillsRank : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Driver:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.topDriverSkills != undefined ? seasonStats.topDriverSkills : "N/A"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Program:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.topProgSkills != undefined ? seasonStats.topProgSkills : "N/A"}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-5 xl:w-[49%] md:w-[47%] w-full bg-neutral-700 p-3 rounded-lg">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Regionals Qual:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.qualToRegionals ? "Yes" : "No"}
                    </h3>
                  </div>
                  <hr/>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl font-bold">
                      Award Worlds Qual:
                    </h3>
                    <h3 className="text-xl">
                      {seasonStats.awardQualToWorlds ? "Yes" : "No"}
                    </h3>
                  </div>
                </div>
              </div>
            </> :
              <h3 className="text-xl mx-2">
                Season Profile Not Found
              </h3>
            }
            </div>
        </> : null}
      </div>
    </main>
  )
}