"use client"
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {TeamProfile, Event} from "@/app/types";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventResult from "@/components/EventResult";
import EventTeamResult from "@/components/EventTeamResult";
import { FaClipboardList } from "react-icons/fa";
import {MdEventNote} from "react-icons/md";


export default function Favorites() {
  const {isLoaded, isSignedIn, user} = useUser();

  const [favoriteTeams, setFavoriteTeams] = useState<TeamProfile[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState<boolean>(false);
  const [currentNotesTeam, setCurrentNotesTeam] = useState<TeamProfile | null>(null);

  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true);

  const [seasonId, setSeasonId] = useState<number>(181);

  const getFavorites = async() => {
    if (!isSignedIn) return;

    setLoadingFavorites(true);

    const promises = [];

    promises.push(async() => {
      try {
        const response = await fetch(`/api/favorites/?favoriteType=team`);

        const data = await response.json();

        if (data.error) {
          toast.error(data.error)
          return;
        }

        setFavoriteTeams(data.favorites);
      } catch (err) {
        console.log(err);
        toast.error("Error getting favorite teams");
      }
    }, async() => {
      try {
        const response = await fetch(`/api/favorites/?favoriteType=event`);

        const data = await response.json();

        if (data.error) {
          toast.error(data.error)
          return;
        }

        setFavoriteEvents(data.favorites);
      } catch (err) {
        console.log(err);
        toast.error("Error getting favorite events");
      }
    });

    await Promise.all(promises.map(async(promise) => {
      await promise();
    }));

    setLoadingFavorites(false);
  }

  useEffect(() => {
    if (isSignedIn) {
      getFavorites();
    }
  }, [isSignedIn, seasonId, isLoaded]);


  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center py-32 sm:py-32">
        <div className="relative flex h-auto flex-col justify-center rounded-2xl sm:bg-neutral-800 sm:p-8 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px]">
          <h1 className="mb-5 min-w-fit text-4xl font-bold sm:text-8xl md:text-5xl lg:text-8xl text-shadow-sm sm:text-shadow lg:text-shadow-lg shadow-stone-400">
            Favorites
          </h1>
          <p className="mb-5 text-lg font-semibold text-gray-300 md:text-xl">
            View your favorite teams and events. Select a season to view relevant match notes and events.
          </p>
        </div>
        <hr className="sm:hidden block my-8 w-11/12 border-t-2 border-neutral-500"/>
        <Tabs defaultValue="teams">
          <TabsList className="fixed sm:relative z-50 sm:z-0 bottom-0 left-0 px-2 pb-7 sm:pb-0 sm:bg-neutral-800 sm:h-10 h-[90px] flex w-screen sm:w-min sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] sm:my-8 [&>*]:flex-1 bg-gradient-to-b
   to-neutral-800 from-GSGray sm:to-neutral-800 sm:from-neutral-800">
            <TabsTrigger value="teams" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
              <FaClipboardList className="inline-block sm:mr-2 text-lg" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="events" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
              <MdEventNote className="inline-block sm:mr-2 text-lg" />
              Events
            </TabsTrigger>
          </TabsList>
          <div className="relative flex h-auto flex-col justify-center rounded-2xl sm:bg-neutral-800 sm:p-8 mb-10 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px]">
            <TabsContent value="teams">
              <div className="mb-10 flex flex-col justify-between md:flex-row">
                <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
                  Teams
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    className="h-10 w-48 sm:h-12 text-sm rounded-lg p-3 text-black sm:w-52 md:ml-auto lg:w-80"
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
                {favoriteTeams.length === 0 && !loadingFavorites ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    No favorite teams found
                  </h1>
                ) : null}
                {loadingFavorites && isSignedIn ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    Loading...
                  </h1>
                ) : loadingFavorites && !isSignedIn ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    You must be signed in to view your favorites
                  </h1>
                ) : null}
                {favoriteTeams.length !== 0 ? favoriteTeams.map((result: TeamProfile) => {
                  const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamEventRegion || result.teamRegion ? result.teamEventRegion || result.teamRegion + ", " : ""}${result.teamCountry}`;

                  return (
                    <EventTeamResult
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
            <TabsContent value="events">
              <div className="mb-10 flex flex-col justify-between md:flex-row">
                <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
                  Events
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    className="h-10 w-48 sm:h-12 text-sm rounded-lg p-3 text-black sm:w-52 md:ml-auto lg:w-80"
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
                {favoriteEvents.length === 0 && !loadingFavorites ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    No favorite events found
                  </h1>
                ) : null}
                {loadingFavorites && isSignedIn ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    Loading...
                  </h1>
                ) : loadingFavorites && !isSignedIn ? (
                  <h1 className="text-3xl font-semibold text-center text-gray-300">
                    You must be signed in to view your favorites
                  </h1>
                ) : null}
                {favoriteEvents.length !== 0 ? favoriteEvents.map((result: Event) => {
                  if (result.season.id !== seasonId) return null;

                  const locationString = `${result.location.venue ? result.location.venue + ' @ ' : ''}${result.location.city ? result.location.city + ", " : ""}${result.location.region ? result.location.region + ", " : ""}${result.location.country}`;

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
