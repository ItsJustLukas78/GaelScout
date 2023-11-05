"use client"
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {TeamProfile, Event} from "@/app/types";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventResult from "@/components/EventResult";
import MatchTeamResult from "@/components/MatchTeamResult";


export default function Favorites({ params }: { params: { teamNumber: string } }) {
  const { isSignedIn, user } = useUser();

  const [favoriteTeams, setFavoriteTeams] = useState<TeamProfile[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState<boolean>(false);
  const [currentNotesTeam, setCurrentNotesTeam] = useState<TeamProfile | null>(null);


  const [seasonId, setSeasonId] = useState<number>(181);

  const getFavorites = () => {
    fetch(`/api/favorites?favoriteType=team`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error)
          return;
        }

        setFavoriteTeams(data.favorites);
      }).catch((error) => {
        console.log(error);
        toast.error("Error getting favorite teams");
      });
    }).catch((error) => {
      console.log(error);
      toast.error("Error getting favorite teams");
    });

    fetch(`/api/favorites?favoriteType=event`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error)
          return;
        }

        setFavoriteEvents(data.favorites);
      }).catch((error) => {
        console.log(error);
        toast.error("Error getting favorite events");
      });
    }).catch((error) => {
      console.log(error);
      toast.error("Error getting favorite events");
    });
  }

  useEffect(() => {
    if (isSignedIn) {
      getFavorites();
    }
  }, [isSignedIn]);


  return (
    <main>
      <div className="sm:py-32 py-32 flex w-full flex-col items-center justify-center">
        <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
          <h1 className="mb-5 min-w-fit text-5xl font-bold xs:text-5xl sm:text-8xl md:text-5xl lg:text-8xl">
            Favorites
          </h1>
          <p className="mb-5 text-lg font-semibold text-gray-300 md:text-xl">
            View your favorite teams and events. Select a season to view relevant match notes and events.
          </p>
        </div>
        <Tabs defaultValue="teams">
          <TabsList className="bg-neutral-800 flex min-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] my-8 [&>*]:flex-1">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
            <TabsContent value="teams">
              <div className="mb-10 flex flex-col justify-between md:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0">
                  Teams
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
                {favoriteTeams.length !== 0 ? favoriteTeams.map((result: TeamProfile) => {
                  const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamRegion ? result.teamRegion + ", " : ""}${result.teamCountry}`;

                  return (
                    <MatchTeamResult
                      key={result.teamNumber}
                      teamId={result.teamId}
                      teamNumber={result.teamNumber}
                      teamName={result.teamName}
                      programCode={result.programCode}
                      teamGrade={result.teamGrade}
                      location={locationString}
                      teamOrg={result.teamOrg}
                      openMatchNotes={(teamId: number) => {
                        if (isSignedIn) {
                          const foundTeamProfile = favoriteTeams.find((team) => team.teamId === teamId);
                          if (!foundTeamProfile) {
                            toast.error("Team not found");
                            setCurrentNotesTeam(null)
                            setTeamNotesDialogOpen(false)
                            return;
                          }
                          setCurrentNotesTeam(foundTeamProfile);
                          setTeamNotesDialogOpen(true);
                        } else {
                          toast.error("You must be signed in to view match notes");
                        }
                      }}
                    />
                  )
                }) : null}
              </div>
              {isSignedIn ?
                <TeamNotesDialog
                  teamNotesDialogOpen={teamNotesDialogOpen}
                  currentNotesTeam={currentNotesTeam}
                  seasonId={seasonId}
                  setTeamNotesDialogOpen={setTeamNotesDialogOpen}
                />
              : null}
            </TabsContent>
            <TabsContent value="matches">
              <div className="mb-10 flex flex-col justify-between xl:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl xl:mb-0">
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
                {favoriteEvents.length !== 0 ? favoriteEvents.map((result: Event) => {
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
                }) : null}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
