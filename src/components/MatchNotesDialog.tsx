"use client"
import React, {useCallback, useEffect, useState} from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import CheckboxDiv from "@/components/CheckboxDiv";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Event, TeamProfile, TeamSeasonProfile, EventMatch, TeamIdentifiers } from "@/app/types";
import Tiptap from "@/components/Tiptap";
import MatchResultNavigator from "@/components/MatchResultNavigator";
import {
  BsArrowReturnLeft,
  BsArrowReturnRight,
} from "react-icons/bs";

export default function MatchNotesDialog({ matchNotesDialogOpen, eventObject, matchList, setMatchNotesDialogOpen }: { matchNotesDialogOpen: boolean, eventObject: Event | null, matchList: EventMatch[], setMatchNotesDialogOpen: (open: boolean) => void }) {
  const [currentMatch, setCurrentMatch] = useState<EventMatch>(matchList[0])
  const [currentTeam, setCurrentTeam] = useState(currentMatch?.blueTeams[0])

  const [currentEditor, setCurrentEditor] = useState<any>(null)

  const [teamToMatchNotes, setTeamToMatchNotes] = useState<{[key: string]: object}>({})

  const [completedinitialFetch, setCompletedInitialFetch] = useState(false)

  const [loading, setLoading] = useState(false)

  const changeTeamNotes = (team: TeamIdentifiers) => {
    if (currentEditor) {
      setTeamToMatchNotes((prev) => {
        return {
          ...prev,
          [currentTeam?.teamNumber]: currentEditor.getJSON()
        }
      });
      currentEditor.commands.clearContent()
      currentEditor.commands.setContent(teamToMatchNotes[team.teamNumber])
    }
    setCurrentTeam(team);
  }

  const saveNotesAndChangeMatch = (match?: EventMatch) => {
    setLoading(true)

    const latestTeamToMatchNotes = {
      ...teamToMatchNotes,
      [currentTeam?.teamNumber]: currentEditor.getJSON()
    }

    fetch(`/api/seasons/${eventObject?.season.id}/notes`, {
      method: "POST",
      body: JSON.stringify({
        notes: latestTeamToMatchNotes
      })
    }).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error);
          setLoading(false)
          return;
        }

        currentEditor.commands.clearContent()
        if (match) {
          setCurrentMatch(match)
        } else {
          setMatchNotesDialogOpen(false)
        }
        setLoading(false)
      });
    }).catch((error) => {
      console.log(error);
      toast.error("An error occurred while saving team notes.");
      setLoading(false)
    });
  }

  const getMatchTeamNotes = (teams: TeamIdentifiers[]) => {
    const teamNotes: {[key: string]: object} = {}

    const searchParams = new URLSearchParams();

    for (const team of teams) {
      searchParams.append("teamNumber", team.teamNumber)
    }

    fetch(`/api/seasons/${eventObject?.season.id}/notes?${searchParams.toString()}`, {
      method: "GET",
    }).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }

        setCurrentTeam(currentMatch?.blueTeams[0])

        setCompletedInitialFetch(true)

        if (data.notes.length === 0) {
          return;
        }

        for (const teamNote of data.notes) {
          teamNotes[teamNote.teamNumber as string] = teamNote.note
        }

        setTeamToMatchNotes(teamNotes)
      });
    }).catch((error) => {
      console.log(error);
      toast.error("An error occurred while fetching team notes.");
    });

    return teamNotes
  }

  useEffect(() => {
    if (currentMatch) {
      getMatchTeamNotes([...currentMatch.blueTeams, ...currentMatch.redTeams])
    }
  }, [currentMatch])

  useEffect(() => {
    if (currentTeam && currentEditor) {
      if (teamToMatchNotes[currentTeam.teamNumber]) {
        currentEditor.commands.setContent(teamToMatchNotes[currentTeam.teamNumber])
      }
    }
  }, [teamToMatchNotes, completedinitialFetch, currentTeam, currentEditor])


  return (
    <AlertDialog.Root
      open={matchNotesDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-40 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[650px] min-w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Match Notes
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={`flex flex-col ${loading ? "animate-pulse" : ""}`}>
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-neutral-200 mb-5">
                  {currentMatch?.name} - {currentTeam?.teamNumber}
                </h1>
                <Tiptap setEditor={setCurrentEditor} />
                <MatchResultNavigator
                  className="mt-5"
                  key={currentMatch?.id}
                  {...currentMatch}
                  teamSetter={changeTeamNotes}
                />
              </div>
              {/* navigate forward or backward through matches */}
              <div className="flex flex-row justify-center mt-5 ">
                <button
                  className="h-8 w-14 text-xl font-semibold text-white items-center justify-center flex"
                  onClick={() => {
                    const currentMatchIndex = matchList.indexOf(currentMatch)
                    if (currentMatchIndex !== 0) {
                      saveNotesAndChangeMatch(matchList[currentMatchIndex - 1])
                    }
                  }}
                >
                  <BsArrowReturnLeft />
                </button>
                {/* text saying match browser */}
                <div className="flex flex-col justify-center items-center mx-5">
                  <h1 className="text-xl font-semibold text-neutral-200">
                    Match Browser
                  </h1>
                </div>
                <button
                  className="h-8 w-14 text-xl font-semibold text-white items-center justify-center flex"
                  onClick={() => {
                    const currentMatchIndex = matchList.indexOf(currentMatch)
                    if (currentMatchIndex !== matchList.length - 1) {
                      saveNotesAndChangeMatch(matchList[currentMatchIndex + 1])
                    }
                  }}
                >
                  <BsArrowReturnRight />
                </button>
              </div>
            </div>
          </AlertDialog.Description>
          <div className="mt-auto flex justify-between">
            <AlertDialog.Action asChild>
              <button
                className="mt-4 h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50 ml-auto"
                onClick={(e) => saveNotesAndChangeMatch()}
                disabled={false}
              >
                Save
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}