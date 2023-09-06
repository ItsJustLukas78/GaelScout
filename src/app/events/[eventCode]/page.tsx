"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import CompactTeamResult from "@/components/CompactTeamResult";

interface Event {
  id: number;
  sku: string;
  name: string;
  start: string;
  end: string;
  season: {
    id: number;
    name: string;
  }
  program: {
    id: number;
    name: string;
    code: string;
  },
  location: {
    venue: string;
    address: string;
    city: string;
    region: string;
    country: string;
  }
}

interface TeamResult {
  teamNumber: string;
  teamName: string;
  programCode: string;
  teamGrade: string;
  teamCity: string;
  teamRegion: string;
  teamCountry: string;
  teamOrg: string;
}

export default function EventPage({ params }: { params: { eventCode: string } }) {
  const eventCode = params.eventCode

  const [eventObject, setEventObject] = useState<Event | null>(null);
  const [paticipatingTeams, setPaticipatingTeams] = useState<TeamResult[]>([]);

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

        // Get teams
        fetch(`/api/events/${data.events[0].id}/teams`).then((response) => {
          response.json().then((data) => {
            if (data.error) {
              toast.error(data.error);
              return;
            }

            console.log(data.teams)

            console.log(typeof data.teams)

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
      <div className="w-full items-center justify-center flex flex-col my-44 gap-16">
        {eventObject ? <>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <h1 className="lg:text-8xl md:text-5xl sm:text-4xl xs:text-3xl text-2xl font-bold mb-10 min-w-fit">
              {eventObject.name}
            </h1>
            <div className="md:gap-10 gap-5 flex flex-row">
              <div className="gap-5 flex flex-col mim-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="sm:text-xl text-md font-bold">
                    Location:
                  </h3>
                  <h3 className="sm:text-lg text-sm">
                    {eventObject.location.city ? eventObject.location.city + ", " : ""}{eventObject.location.region + ", "}{eventObject.location.country}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:text-xl text-md font-bold">
                    SKU:
                  </h3>
                  <h3 className="sm:text-lg text-sm">
                    {eventObject.sku}
                  </h3>
                </div>
              </div>
              <div className="gap-5 flex flex-col min-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="sm:text-xl text-md font-bold">
                    Date:
                  </h3>
                  <h3 className="sm:text-lg text-sm">
                    {formatDate(eventObject.start)} - {formatDate(eventObject.end)}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="sm:text-xl text-md font-bold">
                    Season:
                  </h3>
                  <h3 className="sm:text-lg text-sm">
                    {eventObject.season.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
            <div className="flex md:flex-row flex-col justify-between mb-10">
              <h3 className="lg:text-5xl md:text-3xl xs:text-5xl text-3xl font-bold min-w-fit md:mb-0 mb-5">
                Teams
              </h3>
            </div>
            <div className="w-[100%] gap-4 flex flex-col overflow-auto">
              <table className="table-auto min-w-[100%] rounded-2xl border-separate">
                <thead>
                  <tr className="[&>th]:text-left [&>th]:pl-4 xl:[&>th]:text-xl md:[&>th]:text-md [&>th]:text-sm [&>th]:pb-5">
                    <th>Number</th>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-700 rounded-2xl">
                  {paticipatingTeams.length !== 0 && paticipatingTeams.map((result: TeamResult) => {
                    const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamRegion ? result.teamRegion + ", " : ""}${result.teamCountry}`;

                    return (
                      <tr key={result.teamNumber}>
                        <td className="xl:text-2xl md:text-lg text-sm font-semibold px-4 py-2">
                          <a href={`/teams/${result.teamNumber}`} className="hover:text-blue-500">{result.teamNumber}</a>
                        </td>
                        <td className="xl:text-xl md:text-lg xs:text-sm text-xs px-4 py-2">{result.teamName}</td>
                        <td className="xl:text-xl md:text-lg xs:text-sm text-xs px-4 py-2">{result.teamOrg}</td>
                        <td className="xl:text-xl md:text-lg xs:text-sm text-xs px-4 py-2">{locationString}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/*{paticipatingTeams.length !== 0 && paticipatingTeams.map((result: TeamResult) => {*/}
              {/*  const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamRegion ? result.teamRegion + ", " : ""}${result.teamCountry}`;

                // return (
                //   <CompactTeamResult
                //     key={result.teamNumber}
                //     teamNumber={result.teamNumber}
                //     teamName={result.teamName}
                //     programCode={result.programCode}
                //     teamGrade={result.teamGrade}
                //     location={locationString}
                //     teamOrg={result.teamOrg}
                //   />
                // )
                */}
            </div>
          </div>
        </> : <></>}
      </div>
    </main>
  )
}