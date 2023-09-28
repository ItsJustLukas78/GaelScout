"use client"
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Event, EventMatch, TeamProfile, Division } from "@/app/types";
import ScoutingSheetDialog from "@/components/ScoutingSheetDialog";
import MatchNotesDialog from "@/components/MatchNotesDialog";
import MatchResult from "@/components/MatchResult";
import { useUser } from "@clerk/nextjs";

export default function EventPage({ params }: { params: { eventCode: string } }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const eventCode = params.eventCode

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [eventObject, setEventObject] = useState<Event | null>(null);
  const [paticipatingTeams, setPaticipatingTeams] = useState<TeamProfile[]>([]);

  const [divisionList, setDivisionList] = useState<Division[]>([]);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);
  const [matchList, setMatchList] = useState<EventMatch[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [matchNotesDialogOpen, setMatchNotesDialogOpen] = useState(false);

  const getEvent = () => {
    const skuSearchParams = new URLSearchParams();

    skuSearchParams.append("eventSKU[]", eventCode);

    fetch(`/api/events/?${skuSearchParams.toString()}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }

        if (data.events.length === 0) {
          toast.error("Event not found");
          return;
        }

        setEventObject(data.events[0]);

        setDivisionList(data.events[0].divisions);

        if (data.events[0].divisions.length !== 0) {
          setCurrentDivision(data.events[0].divisions[0]);
        }

        setLoadingTeams(true);

        fetch(`/api/events/${data.events[0].id}/teams`).then((response) => {
          response.json().then((data) => {
            if (data.error) {
              toast.error(data.error);
              setLoadingTeams(false);
              return;
            }

            setLoadingTeams(false);
            setPaticipatingTeams(data.teams);
          });
        });


      });
    });
  }

  const formatDate = (date: string) => {
    return (new Date(date)).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    if (currentDivision) {
      setLoadingMatches(true);

      fetch(`/api/events/${eventObject?.id}/${currentDivision.id}/matches`).then((response) => {
        response.json().then((data) => {
          if (data.error) {
            toast.error(data.error);
            setLoadingMatches(false);
            return;
          }

          setLoadingMatches(false);
          setMatchList(data.matches);
        });
      });
    }
  }, [currentDivision]);

  return (
    <main>
      <div className="my-44 flex w-full flex-col items-center justify-center">
        {eventObject ? <>
          <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] mb-8">
            <h1 className="mb-10 min-w-fit text-2xl font-bold xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
              {eventObject.name}
            </h1>
            <div className="flex flex-row gap-5 md:gap-10">
              <div className="flex flex-col gap-5 mim-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Location:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.location.city ? eventObject.location.city + ", " : ""}{eventObject.location.region + ", "}{eventObject.location.country}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    SKU:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.sku}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5 min-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Date:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {formatDate(eventObject.start)} - {formatDate(eventObject.end)}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Season:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.season.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="teams">
            <TabsList className="bg-neutral-800 flex min-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] mb-8 [&>*]:flex-1">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
              <TabsContent value="teams">
                <div className="mb-10 flex flex-col justify-between md:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0">
                    Teams
                  </h3>
                  <button
                    className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    Generate Scout Sheet
                  </button>
                </div>
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  <table className="table-auto border-separate rounded-2xl min-w-[100%]">
                    <thead>
                      <tr className="md:[&>th]:text-md [&>th]:pb-5 [&>th]:pl-4 [&>th]:text-left [&>th]:text-sm xl:[&>th]:text-xl">
                        <th>Number</th>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody className="rounded-2xl bg-neutral-700">
                      {paticipatingTeams.length !== 0 ? paticipatingTeams.map((result: TeamProfile) => {
                        const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamRegion ? result.teamRegion + ", " : ""}${result.teamCountry}`;

                        return (
                          <tr key={result.teamNumber}>
                            <td className="px-4 py-2 text-sm font-semibold md:text-lg xl:text-2xl">
                              <a href={`/teams/${result.teamNumber}`} className="hover:text-blue-500">{result.teamNumber}</a>
                            </td>
                            <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl">{result.teamName}</td>
                            <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl">{result.teamOrg}</td>
                            <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl">{locationString}</td>
                          </tr>
                        )
                      }) : loadingTeams ?
                        [0,1,2,3,4].map(() => {
                          return (
                            <tr className="animate-pulse h-16" key={Math.random()}>
                              <td className="px-4 py-2 text-sm font-semibold md:text-lg xl:text-2xl bg-gray-400"></td>
                              <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                              <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                              <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                            </tr>
                          )
                        }) : null}
                    </tbody>
                  </table>
                </div>
                <ScoutingSheetDialog
                  exportDialogOpen={exportDialogOpen}
                  eventObject={eventObject}
                  paticipatingTeams={paticipatingTeams}
                  loadingTeams={loadingTeams}
                  setExportDialogOpen={setExportDialogOpen}
                />
              </TabsContent>
              <TabsContent value="matches">
                <div className="mb-10 flex flex-col justify-between md:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl md:mb-0">
                    Matches
                  </h3>
                  <div className="flex sm:flex-row flex-col gap-3">
                    <select
                      className="pl-2 h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg"
                      required
                      value={currentDivision?.id}
                      onChange={(event) => {
                        // @ts-ignore
                        setCurrentDivision(divisionList.find((division) => division.id === event.target.value) || null);
                      }}
                    >
                      <option value={999} disabled hidden>Select Division</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <button
                      className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg disabled:opacity-50"
                      onClick={() => {
                        console.log("clicked")
                        setMatchNotesDialogOpen(true)
                      }}
                      disabled={!isSignedIn}
                    >
                      Match Notes
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  {matchList.length !== 0 ? matchList.map((result: EventMatch) => {
                    return (
                      <MatchResult
                        key={result.id}
                        {...result}
                      />
                    )
                  }) : null}
                </div>
                {isSignedIn ?
                  <MatchNotesDialog
                    matchNotesDialogOpen={matchNotesDialogOpen}
                    eventObject={eventObject}
                    matchList={matchList}
                    setMatchNotesDialogOpen={setMatchNotesDialogOpen}
                  />
                : null}
              </TabsContent>
            </div>
          </Tabs>
        </> : <></>}
      </div>
    </main>
  )
}