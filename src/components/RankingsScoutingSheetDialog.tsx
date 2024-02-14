"use client"
import React, { useState } from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CheckboxDiv from "@/components/CheckboxDiv";
import {Event, TeamProfile, EventRankWithMetrics} from "@/app/types";
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import {useAuth} from "@clerk/nextjs";
import {useGlobalStore} from "@/state/globalState";
import {generateText} from "@tiptap/core";

export default function RankingsScoutingSheetDialog({ exportDialogOpen, eventObject, rankingsWithMetrics, teamProfiles, setExportDialogOpen }: { exportDialogOpen: boolean, eventObject: Event | null, rankingsWithMetrics: EventRankWithMetrics[], teamProfiles: TeamProfile[], setExportDialogOpen: (open: boolean) => void }) {
  const { getToken } = useAuth();

  const currentNotesGroup = useGlobalStore((state) => state.currentNotesGroup);

  const [numberChecked, setNumberChecked] = useState(true);
  const [nameChecked, setNameChecked] = useState(true);
  const [orgChecked, setOrgChecked] = useState(true);
  const [cityChecked, setCityChecked] = useState(false);
  const [regionChecked, setRegionChecked] = useState(true);
  const [countryChecked, setCountryChecked] = useState(false);
  const [gradeChecked, setGradeChecked] = useState(false);
  const [notesChecked, setNotesChecked] = useState(false);
  const [winsChecked, setWinsChecked] = useState(true);
  const [lossesChecked, setLossesChecked] = useState(true);
  const [tiesChecked, setTiesChecked] = useState(true);
  const [oprChecked, setOprChecked] = useState(true);
  const [dprChecked, setDprChecked] = useState(true);
  const [ccwmChecked, setCcwmChecked] = useState(true);
  const [wpChecked, setWpChecked] = useState(false);
  const [apChecked, setApChecked] = useState(false);
  const [spChecked, setSpChecked] = useState(false);
  const [highScoreChecked, setHighScoreChecked] = useState(false);

  const submitExportForm = async (e: any) => {
    e.preventDefault();

    if (eventObject === null || !eventObject.id) {
      toast.error("Event not found");
      return;
    }

    toast.info("Generating sheet...");

    const teamNotes: { [key: string]: object } = {}

    if (notesChecked) {
      // fetch all notes
      const token = await getToken()

      if (!token) {
        toast.error("You must be logged in to export notes")
        return;
      }

      const searchParams = new URLSearchParams();

      for (const team of teamProfiles) {
        searchParams.append("teamNumber", team.teamNumber);
      }

      searchParams.append("notesGroupId", currentNotesGroup?.id.toString() || '')

      const response = await fetch(`/api/seasons/${eventObject?.season.id}/notes?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return;
      }

      for (const note of data.notes) {
        teamNotes[note.teamNumber] = note.note
      }
    }

    enum ShortHandToFull {
      teamNumber = "Number",
      teamName = "Name",
      teamOrg = "Org",
      teamCity = "City",
      teamRegion = "Region",
      teamEventRegion = "Event Region",
      teamCountry = "Country",
      teamGrade = "Grade",
      wins = "Wins",
      losses = "Losses",
      ties = "Ties",
      opr = "OPR",
      dpr = "DPR",
      ccwm = "CCWM",
      wp = "WP",
      ap = "AP",
      sp = "SP",
      high_score = "High Score",
      notes = "Notes"
    }

    const teamValues = {
      teamNumber: numberChecked,
      teamName: nameChecked,
      teamOrg: orgChecked,
      teamCity: cityChecked,
      teamRegion: regionChecked,
      teamEventRegion: regionChecked,
      teamCountry: countryChecked,
      teamGrade: gradeChecked,
      notes: notesChecked,
      wins: winsChecked,
      losses: lossesChecked,
      ties: tiesChecked,
      opr: oprChecked,
      dpr: dprChecked,
      ccwm: ccwmChecked,
      wp: wpChecked,
      ap: apChecked,
      sp: spChecked,
      high_score: highScoreChecked,
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

    rankingsWithMetrics.map((teamRanking: EventRankWithMetrics) => {
      const teamProfile = teamProfiles.find((teamProfile) => {
        return teamProfile.teamId === teamRanking.team.teamId;
      });

      if (!teamProfile) {
        return;
      }

      let csvRow = ""

      for (const [key, value] of Object.entries(teamValues)) {
        if (value) {
          let teamValue = (teamProfile as any)[key] ?? (teamRanking as any)[key];

          if (key === "notes") {
            const notes = teamNotes[teamProfile.teamNumber]

            if (!notes) {
              teamValue = null
            } else {
              teamValue = generateText(notes, [
                StarterKit as any,
                Placeholder,
                CharacterCount,
                Highlight,
                Underline
              ])

              // surround with quotes so newlines are preserved
              teamValue = `"${teamValue}"`
            }
          }

          if ((!teamValue || teamValue === "") && typeof teamValue !== 'number') {
            csvRow += "N/A" + ","
            continue;
          }

          if (typeof teamValue === 'string') {
            teamValue = teamValue.replaceAll(",", "")
          } else if (typeof teamValue === 'number') {
            // @ts-ignore
            if (!Number.isInteger(teamValue)) {
              if (teamValue % 1 !== 0) {
                teamValue = teamValue.toFixed(4)
              } else {
                teamValue = teamValue.toString()
              }
            }
          }

          csvRow += `${teamValue},`;
        }
      }

      csvRow = csvRow.substring(0, csvRow.length - 1) + "\n"

      csvBody += csvRow
    })

    const csv = csvHeader + csvBody

    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${eventObject.name} - ${eventObject.sku} - GaelScout Export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
    toast.success("Exported successfully");
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
                Select all the information you want to be included in the rankings sheet for each team:
              </p>
              <div className="mt-3 flex flex-row justify-between overflow-scroll overflow-x-hidden h-[350px]">
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
                  <CheckboxDiv checked={notesChecked} onCheckedChange={(e) => setNotesChecked((notesChecked) => (!notesChecked))}>
                    Notes
                  </CheckboxDiv>
                  <CheckboxDiv checked={winsChecked} onCheckedChange={(e) => setWinsChecked((winsChecked) => (!winsChecked))}>
                    Wins
                  </CheckboxDiv>
                  <CheckboxDiv checked={lossesChecked} onCheckedChange={(e) => setLossesChecked((lossesChecked) => (!lossesChecked))}>
                    Losses
                  </CheckboxDiv>
                  <CheckboxDiv checked={tiesChecked} onCheckedChange={(e) => setTiesChecked((tiesChecked) => (!tiesChecked))}>
                    Ties
                  </CheckboxDiv>
                  <CheckboxDiv checked={wpChecked} onCheckedChange={(e) => setWpChecked((wpChecked) => (!wpChecked))}>
                    WP
                  </CheckboxDiv>
                  <CheckboxDiv checked={apChecked} onCheckedChange={(e) => setApChecked((apChecked) => (!apChecked))}>
                    AP
                  </CheckboxDiv>
                  <CheckboxDiv checked={spChecked} onCheckedChange={(e) => setSpChecked((spChecked) => (!spChecked))}>
                    SP
                  </CheckboxDiv>
                  <CheckboxDiv checked={highScoreChecked} onCheckedChange={(e) => setHighScoreChecked((highScoreChecked) => (!highScoreChecked))}>
                    High Score
                  </CheckboxDiv>
                </div>
              </div>
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