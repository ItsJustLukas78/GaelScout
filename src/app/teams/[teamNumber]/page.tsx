"use client"
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { TeamProfile, TeamSeasonProfile, Event } from "@/app/types";
import { GiNotebook } from "react-icons/gi";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventResult from "@/components/EventResult";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useRouter } from 'next/navigation'

export default function TeamProfile({ params }: { params: { teamNumber: string } }) {
  const router = useRouter();

  const inputTeamRef = React.useRef<HTMLInputElement>(null);

  const { isSignedIn } = useUser();

  const teamNumber = params.teamNumber

  const [teamNumberInput, setTeamNumberInput] = useState<string>(teamNumber ? teamNumber.toUpperCase() : "");

  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [seasonStats, setSeasonStats] = useState<TeamSeasonProfile | null>(null);
  const [seasonId, setSeasonId] = useState< number >(181);

  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState<boolean>(false);

  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);

  const [favorited, setFavorited] = useState<boolean>(false);

  const getTeam = async(controler: AbortController) => {
    try {
      const response = await fetch(`/api/teams/number/${teamNumberInput.toUpperCase()}`, {
        signal: controler.signal,
      });

      const data = await response.json()

      if (data.error) {
        // toast.error(data.error)
        console.log(data.error);
        setTeamProfile(null);
        return;
      }

      setTeamProfile(data.team)

    } catch (err) {
      toast.error(err as any)
    }
  }

  const getSeasonStats = async(controller : AbortController) => {
    try {
      const response = await fetch(`/api/seasons/${seasonId}/seasonProfile/${teamNumberInput.toUpperCase()}`, {
        signal: controller.signal,
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
        setSeasonStats(null);
        return;
      }

      setSeasonStats(data);
    } catch (err) {
      console.log(err);
      setSeasonStats(null);
    }
  }

  const getEvents = async() => {
    if (!teamProfile) {
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.append("seasonId", seasonId.toString());

    try {
      const response = await fetch(`/api/teams/${teamProfile.teamId}/events/?${searchParams.toString()}`)

      const data = await response.json()

      if (data?.error) {
        toast.error(data.error)
        setCurrentEvents([]);
        return;
      }

      setCurrentEvents(data.events);
    } catch (err) {
      console.log(err);
      setCurrentEvents([]);
    }
  }

  const getFavoriteStatus = async() => {
    if (!teamProfile) {
      return;
    }

    if (!isSignedIn) {
      setFavorited(false);
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.append("teamId", teamProfile.teamId.toString());
    searchParams.append("favoriteType", "team");

    try {
      const response = await fetch(`/api/favorites/?${searchParams.toString()}`)

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        setFavorited(false);
        return;
      }

      setFavorited(data.favorites.length > 0);
    } catch (err) {
      console.log(err);
      setFavorited(false);
    }
  }

  const changeFavoriteStatus = async(favorite: boolean) => {
    if (!teamProfile) {
      return;
    }

    if (!isSignedIn) {
      toast.error("You must be signed in to favorite a team");
      return;
    }

    if (favorite) {
      try {
        const response = await fetch(`/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: teamProfile.teamId,
            teamNumber: teamProfile.teamNumber,
            favoriteType: "team",
          })
        });

        const data = await response.json();


        if (data?.error) {
          toast.error(data.error)
          return;
        }

        setFavorited(data.success);
      } catch (err) {
        toast.error(err as any)
      }
    } else {
      try {
        const response = await fetch(`/api/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: teamProfile.teamId,
            teamNumber: teamProfile.teamNumber,
            favoriteType: "team",
          })
        });

        const data = await response.json();

        if (data?.error) {
          toast.error(data.error)
          return;
        }

        setFavorited(!data.success);
      } catch (err) {
        toast.error(err as any)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getTeam(controller);
    return () => {
      controller.abort("Cancelling override fetch");
    }
  } , [teamNumberInput]);

  useEffect(() => {
    const controller = new AbortController();
    getSeasonStats(controller);
    return () => {
      controller.abort("Cancelling override fetch");
    }
  }, [seasonId, teamNumberInput]);

  useEffect(() => {
    if (teamProfile) {
      getEvents();
      getFavoriteStatus();
    }
  } , [teamProfile, seasonId]);

  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center py-32 sm:py-32">
        <div className="relative flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px]">
          <input
            type="text"
            key="teamInput"
            defaultValue={teamNumberInput}
            ref={inputTeamRef}
            className="mb-5 border-none bg-transparent text-5xl font-bold outline-none xs:text-5xl sm:text-8xl"
            onChange={(event) => {
              event.preventDefault();
              window.history.pushState({}, '', `/teams/${event.target.value.toUpperCase()}`);
              setTeamNumberInput(event.target.value.toUpperCase());
            }}
          >
          </input>
          <a href={`https://www.robotevents.com/teams/VRC/${teamNumberInput.toUpperCase()}`} className="mb-5 max-w-fit text-lg font-bold hover:text-blue-500 xs:text-xl">
            <u>RobotEvents Page</u>
          </a>
          {teamProfile ? <>
            <div className="absolute max-w-max top-0.5 right-0.5 xl:top-2 xl:right-2">
              <button
                className="flex items-center justify-center text-2xl font-extrabold min-w-[50px] min-h-[50px]"
                onClick={(e) => {
                  e.preventDefault()
                  if (isSignedIn) {
                    changeFavoriteStatus(!favorited);
                    return;
                  } else {
                    toast.error("You must be signed in to favorite a team");
                  }
                }}
              >
                {favorited ? <AiFillStar className="inline-block" /> : <AiOutlineStar className="inline-block" />}
              </button>
            </div>
            <div className="flex flex-col gap-5 min-w-auto lg:flex-row lg:gap-14">
              <div className="flex min-w-fit flex-row gap-5 lg:flex-col">
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Name:
                  </h3>
                  <h3 className="font-normal text-md">
                    {teamProfile.teamName ? teamProfile.teamName : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Robot Name:
                  </h3>
                  <h3 className="font-normal text-md">
                    {teamProfile.robotName ? teamProfile.robotName : "N/A"}
                  </h3>
                </div>
              </div>
              <div className="flex min-w-fit flex-row gap-5 lg:flex-col">
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Org:
                  </h3>
                  <h3 className="font-normal text-md">
                    {teamProfile.teamOrg ? (
                      teamProfile.teamOrg.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
                    ) : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Location:
                  </h3>
                  <h3 className="font-normal text-md">
                    {teamProfile.teamCity ? teamProfile.teamCity + ", " : ""}{teamProfile.teamRegion ? teamProfile.teamRegion + ", " : ""}{teamProfile.teamCountry ? teamProfile.teamCountry : ""}
                  </h3>
                </div>
              </div>
              <div className="flex min-w-fit flex-row gap-5 lg:flex-col">
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Program:
                  </h3>
                  <h3 className="font-normal text-md">
                    {teamProfile.programCode ? teamProfile.programCode : "N/A"}
                  </h3>
                </div>
                <div className="flex flex-col w-[49%] lg:w-auto">
                  <h3 className="text-xl font-bold">
                    Grade:
                  </h3>
                  <h3 className="font-normal text-md">
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
        <Tabs defaultValue="statistics">
          <TabsList className="bg-neutral-800 flex min-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] my-8 [&>*]:flex-1">
            <TabsTrigger value="statistics">Season Stats</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
            <TabsContent value="statistics">
              <div className="mb-10 flex flex-col md:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0 md:text-3xl lg:text-5xl">
                  Season Statistics
                </h3>
                <div className="flex flex-row gap-3 md:ml-auto">
                  <select
                    className="h-12 w-52 rounded-lg p-3 text-black sm:w-52 md:ml-auto lg:w-80"
                    required
                    value={seasonId}
                    onChange={(event) => setSeasonId(parseInt(event.target.value))}
                  >
                    <option value="173">Spin Up 2022-23</option>
                    <option value="181">Over Under 2023-24</option>
                  </select>
                  <button
                    className="flex items-center justify-center whitespace-nowrap rounded-md bg-neutral-50 text-xl font-semibold text-black opacity-50 min-w-[50px] min-h-[40px] disabled:opacity-50"
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
                      {seasonStats.openSkill != undefined ? seasonStats.openSkill.toFixed(2) : "N/A"}
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
            </TabsContent>
            <TabsContent value="events">
              <div className="mb-10 flex flex-col justify-between md:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0">
                  Events
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    className="h-12 w-52 rounded-lg p-3 text-black sm:w-52 md:ml-auto lg:w-80"
                    required
                    value={seasonId}
                    onChange={(event) => setSeasonId(parseInt(event.target.value))}
                  >
                    <option value="173">Spin Up 2022-23</option>
                    <option value="181">Over Under 2023-24</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                {currentEvents.length !== 0 && currentEvents.map((result: Event) => {
                  const locationString = `${result.location.city ? result.location.city + ", " : ""}${result.location.region ? result.location.region + ", " : ""}${result.location.country}`;

                  return (
                    <EventResult
                      key={result.id}
                      id={result.id}
                      sku={result.sku}
                      name={result.name}
                      start={result.start}
                      location={locationString}
                    />
                  )
                }
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}