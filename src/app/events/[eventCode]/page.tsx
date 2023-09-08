"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CheckboxDiv from "@/components/CheckboxDiv";
import * as RadioGroup from '@radix-ui/react-radio-group';
import {val} from "cheerio/lib/api/attributes";


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

interface TeamSeasonProfile {
  teamId: number,
  teamName: string,
  teamNumber: string,
  opr: number,
  dpr: number,
  ccwm: number,
  openSkill: number,
  openSkillRank: number,
  eventCount: number,
  topProgSkills: number,
  topDriverSkills: number,
  topTotalSkills: number,
  skillsRank: number,
  qualMatchCount: number,
  elimMatchCount: number,
  qualMatchWins: number,
  elimMatchWins: number,
  qualMatchLosses: number,
  elimMatchLosses: number,
  qualMatchWinPercentage: number,
  elimMatchWinPercentage: number,
  totalMatchWinPercentage: number,
  qualToRegionals: boolean,
  awardQualToWorlds: boolean,
}

enum sortMethod {
  "openSkillRank" = "openSkillRank",
  "skillsRank" = "skillsRank",
  "ccwm" = "ccwm",
}

export default function EventPage({ params }: { params: { eventCode: string } }) {
  const eventCode = params.eventCode

  const [eventObject, setEventObject] = useState<Event | null>(null);
  const [paticipatingTeams, setPaticipatingTeams] = useState<TeamResult[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [numberChecked, setNumberChecked] = useState(true);
  const [nameChecked, setNameChecked] = useState(true);
  const [orgChecked, setOrgChecked] = useState(false);
  const [cityChecked, setCityChecked] = useState(false);
  const [regionChecked, setRegionChecked] = useState(true);
  const [countryChecked, setCountryChecked] = useState(false);
  const [gradeChecked, setGradeChecked] = useState(false);
  const [oprChecked, setOprChecked] = useState(true);
  const [dprChecked, setDprChecked] = useState(true);
  const [ccwmChecked, setCcwmChecked] = useState(true);
  const [gopnChecked, setGopnChecked] = useState(true);
  const [gskrChecked, setGskrChecked] = useState(true);
  const [tcsChecked, setTcsChecked] = useState(true);
  const [psChecked, setPsChecked] = useState(false);
  const [dsChecked, setDsChecked] = useState(false);
  const [qwpChecked, setQwpChecked] = useState(false);
  const [ewpChecked, setEwpChecked] = useState(false);
  const [qtrChecked, setQtrChecked] = useState(false);
  const [awqtwChecked, setAwqtwChecked] = useState(false);

  const [sortMethod, setSortMethod] = useState<sortMethod>("openSkillRank" as sortMethod);


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

        // Get teams
        fetch(`/api/events/${data.events[0].id}/teams`).then((response) => {
          response.json().then((data) => {
            if (data.error) {
              toast.error(data.error);
              return;
            }

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

  const submitExportForm = (e: any) => {
    e.preventDefault();

    if (eventObject === null || !eventObject.id) {
      toast.error("Event not found");
      return;
    }

    toast.info("Generating sheet...");

    enum ShortHandToFull {
      "opr" = "OPR",
      "dpr" = "DPR",
      "ccwm" = "CCWM",
      "openSkillRank" = "Global OpenSkill Rank",
      "skillsRank" = "Global Skills Rank",
      "topTotalSkills" = "Top Combined Skills",
      "topProgSkills" = "Prog Skills",
      "topDriverSkills" = "Driver Skills",
      "qualMatchWinPercentage" = "Qual Win Percentage",
      "elimMatchWinPercentage" = "Elim Win Percentage",
      "qualToRegionals" = "Qualified to Regionals",
      "awardQualToWorlds" = "Awards-Qualified to Worlds",
      "teamNumber" = "Number",
      "teamName" = "Name",
      "teamOrg" = "Organization",
      "teamCity" = "City",
      "teamRegion" = "Region",
      "teamCountry" = "Country",
      "teamGrade" = "Grade",
    }

    const teamValues = {
      teamNumber: numberChecked,
      teamName: nameChecked,
      teamOrg: orgChecked,
      teamCity: cityChecked,
      teamRegion: regionChecked,
      teamCountry: countryChecked,
      teamGrade: gradeChecked,
      opr: oprChecked,
      dpr: dprChecked,
      ccwm: ccwmChecked,
      openSkillRank: gopnChecked,
      skillsRank: gskrChecked,
      topTotalSkills: tcsChecked,
      topProgSkills: psChecked,
      topDriverSkills: dsChecked,
      qualMatchWinPercentage: qwpChecked,
      elimMatchWinPercentage: ewpChecked,
      qualToRegionals: qtrChecked,
      awardQualToWorlds: awqtwChecked,
    }

    const getTeamSeasonProfiles = async (): Promise<null | TeamSeasonProfile[]> => {
      try {
        const response = await fetch(`/api/events/${eventObject.id}/seasonProfiles/?seasonId=${eventObject.season.id}`)
        const data = await response.json()

        if (data.error) {
          toast.error(data.error);
          return null;
        }

        return data.teamSeasonProfiles;

      } catch (e) {
        toast.error("An error occurred while getting team season profiles");
        return null;
      }
    }

    getTeamSeasonProfiles().then((teamSeasonProfiles: TeamSeasonProfile[] | null) => {
      if (teamSeasonProfiles === null) {
        toast.error("An error occurred while getting team season profiles");
        return;
      }

      let csvHeader = ""
      let csvBody = ""

      for (const [key, value] of Object.entries(teamValues)) {
        if (value) {
          const enumKey = key as keyof typeof ShortHandToFull;
          csvHeader += ShortHandToFull[enumKey] + ","
        }
      }

      csvHeader = csvHeader.substring(0, csvHeader.length - 1)

      csvHeader = csvHeader + "\n"

      interface TeamProfileWithTeamSeasonProfile extends TeamResult, TeamSeasonProfile {}

      // make a list of objects representing both the team and their season profile
      const teamSeasonProfilesWithTeam: TeamResult[] | TeamProfileWithTeamSeasonProfile[] = paticipatingTeams.map((team) => {
        const currentTeamNumber = team.teamNumber;

        const currentTeamSeasonProfile = teamSeasonProfiles.find((teamSeasonProfile) => {
          return teamSeasonProfile.teamNumber === currentTeamNumber;
        });

        if (!currentTeamSeasonProfile) {
          return team;
        }

        return {
          ...team,
          ...currentTeamSeasonProfile,
        }
      })

      // sort the list of objects using the sort method
      teamSeasonProfilesWithTeam.sort((a: TeamResult | TeamProfileWithTeamSeasonProfile, b: TeamResult | TeamProfileWithTeamSeasonProfile) => {
        // account for season profiles that don't exist
        if (!a.hasOwnProperty(sortMethod) && !b.hasOwnProperty(sortMethod)) {
          return 0;
        }

        if (!a.hasOwnProperty(sortMethod)) {
          return 1;
        }

        if (!b.hasOwnProperty(sortMethod)) {
          return -1;
        }

        // @ts-ignore
        if (a[sortMethod] < b[sortMethod]) {
          return -1;
          // @ts-ignore
        } else if (a[sortMethod] > b[sortMethod]) {
          return 1;
        } else {
          return 0;
        }
      })

      teamSeasonProfilesWithTeam.map((team: TeamResult | TeamProfileWithTeamSeasonProfile) => {
        let csvRow = ""

        for (const [key, value] of Object.entries(teamValues)) {
          if (value) {
            const enumKey = key as keyof typeof team;
            let teamValue: string | number | undefined = team[enumKey] as string | number | undefined;

            if (!teamValue || teamValue === "") {
              csvRow += "N/A" + ","
              continue;
            }

            if (typeof teamValue === 'string') {
              teamValue = teamValue.replaceAll(",", "")
            } else if (typeof teamValue === 'number') {
              // @ts-ignore
              if (!Number.isInteger(teamValue)) {
                teamValue = teamValue.toFixed(4)
              }
            }

            csvRow += `${teamValue},`;
          }
        }

        csvRow = csvRow.substring(0, csvRow.length - 1) + "\n"

        csvBody += csvRow
      })

      const csv = csvHeader + csvBody

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${eventObject.name} - ${eventObject.sku}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportDialogOpen(false);
      toast.success("Exported successfully");
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
            <h1 className="lg:text-7xl md:text-5xl sm:text-4xl xs:text-3xl text-2xl font-bold mb-10 min-w-fit">
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
          <AlertDialog.Root
            open={exportDialogOpen}
            onOpenChange={(open) => {}}
          >
            <div className="h-auto items-left justify-center flex flex-col xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[700px] sm:min-w-[500px] max-w-[340px] rounded-2xl bg-neutral-800 p-8">
              <div className="flex md:flex-row flex-col justify-between mb-10">
                <h3 className="xs:text-5xl text-3xl font-bold min-w-fit md:mb-0 mb-5">
                  Teams
                </h3>
                <AlertDialog.Trigger asChild>
                  <button
                    className="md:h-12 h-8 md:text-lg text-sm text-black rounded-lg md:w-52 w-44 bg-white"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    Generate Scout Sheet
                  </button>
                </AlertDialog.Trigger>
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
              </div>
            </div>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="z-40 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
              <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[650px] w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <AlertDialog.Title className="text-xl font-bold mb-5">
                  Generate Scouting Sheet (CSV)
                </AlertDialog.Title>
                <AlertDialog.Description asChild>
                  <form
                    id="exportOptionsForm"
                    className="flex flex-col"
                  >
                    <p className="xs:text-md text-sm font-semibold">
                      Select all the information you want to be included in the sheet for each team:
                    </p>
                    <div className="flex flex-row justify-between overflow-scroll h-[300px] overflow-x-hidden mt-3">
                      <div className="flex flex-col">
                        <CheckboxDiv checked={numberChecked} onCheckedChange={(e) => setNumberChecked((numberChecked) => (!numberChecked))}>
                          Number
                        </CheckboxDiv>
                        <CheckboxDiv checked={nameChecked} onCheckedChange={(e) => setNameChecked((nameChecked) => (!nameChecked))}>
                          Name
                        </CheckboxDiv>
                        <CheckboxDiv checked={orgChecked} onCheckedChange={(e) => setOrgChecked((orgChecked) => (!orgChecked))}>
                          Org
                        </CheckboxDiv>
                        <CheckboxDiv checked={cityChecked} onCheckedChange={(e) => setCityChecked((cityChecked) => (!cityChecked))}>
                          City
                        </CheckboxDiv>
                        <CheckboxDiv checked={regionChecked} onCheckedChange={(e) => setRegionChecked((regionChecked) => (!regionChecked))}>
                          Region
                        </CheckboxDiv>
                        <CheckboxDiv checked={countryChecked} onCheckedChange={(e) => setCountryChecked((countryChecked) => (!countryChecked))}>
                          Country
                        </CheckboxDiv>
                        <CheckboxDiv checked={gradeChecked} onCheckedChange={(e) => setGradeChecked((gradeChecked) => (!gradeChecked))}>
                          Grade
                        </CheckboxDiv>
                        <CheckboxDiv checked={oprChecked} onCheckedChange={(e) => setOprChecked((oprChecked) => (!oprChecked))}>
                          OPR
                        </CheckboxDiv>
                        <CheckboxDiv checked={dprChecked} onCheckedChange={(e) => setDprChecked((dprChecked) => (!dprChecked))}>
                          DPR
                        </CheckboxDiv>
                        <CheckboxDiv checked={ccwmChecked} onCheckedChange={(e) => setCcwmChecked((ccwmChecked) => (!ccwmChecked))}>
                          CCWM
                        </CheckboxDiv>
                      </div>
                      <div className="flex flex-col max-w-[60%]">
                        <CheckboxDiv checked={gopnChecked} onCheckedChange={(e) => setGopnChecked((gopnChecked) => (!gopnChecked))}>
                          OpenSkill Rank
                        </CheckboxDiv>
                        <CheckboxDiv checked={gskrChecked} onCheckedChange={(e) => setGskrChecked((gskrChecked) => (!gskrChecked))}>
                          Skills Rank
                        </CheckboxDiv>
                        <CheckboxDiv checked={tcsChecked} onCheckedChange={(e) => setTcsChecked((tcsChecked) => (!tcsChecked))}>
                          Total Skills
                        </CheckboxDiv>
                        <CheckboxDiv checked={psChecked} onCheckedChange={(e) => setPsChecked((psChecked) => (!psChecked))}>
                          Prog Skills
                        </CheckboxDiv>
                        <CheckboxDiv checked={dsChecked} onCheckedChange={(e) => setDsChecked((dsChecked) => (!dsChecked))}>
                          Driver Skills
                        </CheckboxDiv>
                        <CheckboxDiv checked={qwpChecked} onCheckedChange={(e) => setQwpChecked((qwpChecked) => (!qwpChecked))}>
                          Qual Win %
                        </CheckboxDiv>
                        <CheckboxDiv checked={ewpChecked} onCheckedChange={(e) => setEwpChecked((ewpChecked) => (!ewpChecked))}>
                          Elim Win %
                        </CheckboxDiv>
                        <CheckboxDiv checked={qtrChecked} onCheckedChange={(e) => setQtrChecked((qtrChecked) => (!qtrChecked))}>
                          Qual to Regionals
                        </CheckboxDiv>
                        <CheckboxDiv checked={awqtwChecked} onCheckedChange={(e) => setAwqtwChecked((awqtwChecked) => (!awqtwChecked))}>
                          Awards-Qual to Worlds
                        </CheckboxDiv>
                      </div>
                    </div>
                    <p className="xs:text-md text-sm font-semibold mt-5">
                      Sort by:
                    </p>
                    <RadioGroup.Root
                      className="flex flex-row gap-3 mt-3"
                      value={sortMethod}
                      onValueChange={(value: sortMethod) => setSortMethod(value)}
                    >
                      <div className="flex items-center">
                        <RadioGroup.Item
                          className="bg-white w-[25px] h-[25px] rounded-full"
                          value="openSkillRank"
                          id="openSkillRank"
                        >
                          <RadioGroup.Indicator className="flex items-center rounded-full justify-center w-full h-full bg-violet-400" />
                        </RadioGroup.Item>
                        <label className="text-white text-[15px] pl-[15px]" htmlFor="openSkillRank">
                          OpenSkill
                        </label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroup.Item
                          className="bg-white w-[25px] h-[25px] rounded-full"
                          value="skillsRank"
                          id="skillsRank"
                        >
                          <RadioGroup.Indicator className="flex items-center rounded-full justify-center w-full h-full bg-violet-400" />
                        </RadioGroup.Item>
                        <label className="text-white text-[15px] pl-[15px]" htmlFor="skillsRank">
                          Skills
                        </label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroup.Item
                          className="bg-white w-[25px] h-[25px] rounded-full"
                          value="ccwm"
                          id="ccwm"
                        >
                          <RadioGroup.Indicator className="flex items-center rounded-full justify-center w-full h-full bg-violet-400" />
                        </RadioGroup.Item>
                        <label className="text-white text-[15px] pl-[15px]" htmlFor="ccwm">
                          CCWM
                        </label>
                      </div>
                    </RadioGroup.Root>
                    <p className="xs:text-sm text-xs mt-5">
                      Some values may not be available if a team has not competed in the current season and has not been analyzed yet.
                    </p>
                  </form>
                </AlertDialog.Description>
                <div className="flex justify-between mt-auto">
                  <AlertDialog.Cancel asChild>
                    <button
                      className="mt-4 mb-2 bg-red-300 rounded-md whitespace-nowrap h-8 w-28 text-black text-xl font-semibold"
                      onClick={() => setExportDialogOpen(false)}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="mt-4 bg-green-300 rounded-md whitespace-nowrap h-8 w-28 text-black text-xl font-semibold disabled:opacity-50"
                      onClick={(e) => submitExportForm(e)}
                      disabled={false}
                    >
                      Export
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </> : <></>}
      </div>
    </main>
  )
}