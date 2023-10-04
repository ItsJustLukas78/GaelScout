"use client"
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { TeamProfile, TeamSeasonProfile } from "@/app/types";
import { GiNotebook } from "react-icons/gi";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import { useUser } from "@clerk/nextjs";

export default function TeamProfile({ params }: { params: { teamNumber: string } }) {
  const { isSignedIn } = useUser();

  const teamNumber = params.teamNumber

  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [seasonStats, setSeasonStats] = useState<TeamSeasonProfile | null>(null);
  const [seasonId, setSeasonId] = useState< number >(181);

  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState<boolean>(false);


  const getTeam = () => {
    fetch(`/api/teams/${teamNumber.toUpperCase()}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error)
          return;
        }
        setTeamProfile(data.team)
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  const getSeasonStats = () => {
    fetch(`/api/seasons/${seasonId}/seasonProfile/${teamNumber.toUpperCase()}`).then((response) => {
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
      <div className="my-44 flex w-full flex-col items-center justify-center gap-16">
        <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
          <h1 className="mb-10 min-w-fit text-5xl font-bold xs:text-5xl sm:text-8xl md:text-5xl lg:text-8xl">
            Team #{teamNumber.toUpperCase()}
          </h1>
          {teamProfile ? <>
            <div className="flex flex-col gap-5 min-w-auto md:flex-row md:gap-14">
              <div className="flex min-w-fit flex-row gap-5 md:flex-col">
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Team Name:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamName ? teamProfile.teamName : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Robot Name:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.robotName ? teamProfile.robotName : "N/A"}
                  </h3>
                </div>
              </div>
              <div className="flex min-w-fit flex-row gap-5 md:flex-col">
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Organization:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamOrg ? teamProfile.teamOrg : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Location:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamCity ? teamProfile.teamCity + ", " : ""}{teamProfile.teamRegion ? teamProfile.teamRegion + ", " : ""}{teamProfile.teamCountry ? teamProfile.teamCountry : ""}
                  </h3>
                </div>
              </div>
              <div className="flex min-w-fit flex-row gap-5 md:flex-col">
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Program:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.programCode ? teamProfile.programCode : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] md:w-auto">
                  <h3 className="text-xl font-bold">
                    Grade:
                  </h3>
                  <h3 className="text-md">
                    {teamProfile.teamGrade ? teamProfile.teamGrade : "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </> :
            <h3 className="mb-5 text-xl">
              Team Profile Not Found
            </h3>
          }
          </div>
        <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
          <div className="mb-10 flex flex-col md:flex-row">
            <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0 md:text-3xl lg:text-5xl">
              Season Statistics
            </h3>
            <div className="flex flex-row gap-3 md:ml-auto">
              <select
                className="h-12 w-48 md:ml-auto rounded-lg p-3 text-black sm:w-52 lg:w-80"
                required
                value={seasonId}
                onChange={(event) => setSeasonId(parseInt(event.target.value))}
              >
                <option value="173">Spin Up 2022-2023</option>
                <option value="181">Over Under 2023-2024</option>
              </select>
              <button
                className="opacity-50 flex min-w-[50px] min-h-[40px] whitespace-nowrap rounded-md bg-neutral-50 text-xl font-semibold text-black disabled:opacity-50 items-center justify-center"
                onClick={(e) => {
                  e.preventDefault()
                  if (isSignedIn) {
                    setTeamNotesDialogOpen(true)
                    return;
                  } else {
                    toast.error("You must be signed in to view team notes");
                  }
                }}
            >
              <GiNotebook className="inline-block" />
            </button>
            </div>
          </div>
          {seasonStats ? <>
            <div className="mx-2 flex flex-row flex-wrap justify-center gap-5 md:justify-between">
              <div className="flex w-full flex-col gap-5 rounded-lg bg-neutral-700 p-3 md:w-[47%] xl:w-[49%]">
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
              <div className="flex w-full flex-col gap-5 rounded-lg bg-neutral-700 p-3 md:w-[47%] xl:w-[49%]">
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
              <div className="flex w-full flex-col gap-5 rounded-lg bg-neutral-700 p-3 md:w-[47%] xl:w-[49%]">
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
              <div className="flex w-full flex-col gap-5 rounded-lg bg-neutral-700 p-3 md:w-[47%] xl:w-[49%]">
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
              <div className="flex w-full flex-col gap-5 rounded-lg bg-neutral-700 p-3 md:w-[47%] xl:w-[49%]">
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
            {isSignedIn ?
              <TeamNotesDialog
                teamNotesDialogOpen={teamNotesDialogOpen}
                currentNotesTeam={teamProfile}
                seasonId={seasonId}
                setTeamNotesDialogOpen={setTeamNotesDialogOpen}
              />
            : null}
          </> :
            <h3 className="mx-2 text-xl">
              Season Profile Not Found
            </h3>
          }
          </div>
      </div>
    </main>
  )
}