"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CheckboxDiv from "@/components/CheckboxDiv";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Event, TeamProfile, TeamSeasonProfile } from "@/app/types";

enum sortMethod {
  "openSkillRank" = "openSkillRank",
  "skillsRank" = "skillsRank",
  "ccwm" = "ccwm",
}

export default function ScoutingSheetDialog({ exportDialogOpen, eventObject, participatingTeams, loadingTeams, setExportDialogOpen }: { exportDialogOpen: boolean, eventObject: Event | null, participatingTeams: TeamProfile[], loadingTeams: boolean, setExportDialogOpen: (open: boolean) => void }) {

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

      interface TeamProfileWithTeamSeasonProfile extends TeamProfile, TeamSeasonProfile {}

      // make a list of objects representing both the team and their season profile
      const teamSeasonProfilesWithTeam: TeamProfile[] | TeamProfileWithTeamSeasonProfile[] = participatingTeams.map((team) => {
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
      teamSeasonProfilesWithTeam.sort((a: TeamProfile | TeamProfileWithTeamSeasonProfile, b: TeamProfile | TeamProfileWithTeamSeasonProfile) => {
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

      teamSeasonProfilesWithTeam.map((team: TeamProfile | TeamProfileWithTeamSeasonProfile) => {
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

  return (
    <AlertDialog.Root
      open={exportDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-50 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[650px] w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Generate Scouting Sheet (CSV)
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <form
              id="exportOptionsForm"
              className="flex flex-col"
            >
              <p className="text-sm font-semibold xs:text-md">
                Select all the information you want to be included in the sheet for each team:
              </p>
              <div className="mt-3 flex flex-row justify-between overflow-scroll overflow-x-hidden h-[300px]">
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
              <p className="mt-5 text-sm font-semibold xs:text-md">
                Sort by:
              </p>
              <RadioGroup.Root
                className="mt-3 flex flex-row gap-3"
                value={sortMethod}
                onValueChange={(value: sortMethod) => setSortMethod(value)}
              >
                <div className="flex items-center">
                  <RadioGroup.Item
                    className="rounded-full bg-white w-[25px] h-[25px]"
                    value="openSkillRank"
                    id="openSkillRank"
                  >
                    <RadioGroup.Indicator className="flex h-full w-full items-center justify-center rounded-full bg-violet-400" />
                  </RadioGroup.Item>
                  <label className="text-white text-[15px] pl-[15px]" htmlFor="openSkillRank">
                    OpenSkill
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroup.Item
                    className="rounded-full bg-white w-[25px] h-[25px]"
                    value="skillsRank"
                    id="skillsRank"
                  >
                    <RadioGroup.Indicator className="flex h-full w-full items-center justify-center rounded-full bg-violet-400" />
                  </RadioGroup.Item>
                  <label className="text-white text-[15px] pl-[15px]" htmlFor="skillsRank">
                    Skills
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroup.Item
                    className="rounded-full bg-white w-[25px] h-[25px]"
                    value="ccwm"
                    id="ccwm"
                  >
                    <RadioGroup.Indicator className="flex h-full w-full items-center justify-center rounded-full bg-violet-400" />
                  </RadioGroup.Item>
                  <label className="text-white text-[15px] pl-[15px]" htmlFor="ccwm">
                    CCWM
                  </label>
                </div>
              </RadioGroup.Root>
              <p className="mt-5 text-xs xs:text-sm">
                Some values may not be available if a team has not competed in the current season and has not been analyzed yet.
              </p>
            </form>
          </AlertDialog.Description>
          <div className="mt-auto flex justify-between">
            <AlertDialog.Cancel asChild>
              <button
                className="mt-4 mb-2 h-8 w-28 whitespace-nowrap rounded-md bg-red-300 text-xl font-semibold text-black"
                onClick={() => setExportDialogOpen(false)}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="mt-4 h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50"
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
  )
}