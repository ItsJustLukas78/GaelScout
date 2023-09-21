"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CheckboxDiv from "@/components/CheckboxDiv";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Event, TeamProfile, TeamSeasonProfile } from "@/app/types";
import ScoutingSheetDialog from "@/components/ScoutingSheetDialog";

export default function EventPage({ params }: { params: { eventCode: string } }) {
  const eventCode = params.eventCode

  const [loadingTeams, setLoadingTeams] = useState(false);

  const [eventObject, setEventObject] = useState<Event | null>(null);
  const [paticipatingTeams, setPaticipatingTeams] = useState<TeamProfile[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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

        toast.info("Loading teams...");

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

  return (
    <main>
      <div className="my-44 flex w-full flex-col items-center justify-center gap-16">
        {eventObject ? <>
          <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
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
          {/* choose tab */}
          <div className="flex flex-row gap-5">
            <button className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg">
              Match Schedule
            </button>
            <button className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg">
              Match Results
            </button>
            <button className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg">
              Rankings
            </button>
            <button className="h-8 w-44 rounded-lg bg-white text-sm text-black md:h-12 md:w-52 md:text-lg">
              Awards
            </button>
          </div>
          <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
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
          </div>
        </> : <></>}
      </div>
    </main>
  )
}