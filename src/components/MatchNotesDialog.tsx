"use client"
import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {Event, EventMatch, TeamIdentifiers, NotesGroup} from "@/app/types";
import Tiptap from "@/components/Tiptap";
import MatchResultNavigator from "@/components/MatchResultNavigator";
import {
  BsArrowReturnLeft,
  BsArrowReturnRight,
} from "react-icons/bs";
import { useAuth } from "@clerk/nextjs";
import {useGlobalStore} from "@/state/globalState";
import NotesGroupComponent from "@/components/NotesGroupComponent";

export default function MatchNotesDialog({ matchNotesDialogOpen, eventObject, matchList, setMatchNotesDialogOpen }: { matchNotesDialogOpen: boolean, eventObject: Event | null, matchList: EventMatch[], setMatchNotesDialogOpen: (open: boolean) => void }) {
  const { getToken } = useAuth();

  const currentNotesGroup = useGlobalStore((state) => state.currentNotesGroup);
  const currentNotesGroups = useGlobalStore((state) => state.currentNotesGroups);

  const [previousNotesGroup, setPreviousNotesGroup] = useState<NotesGroup | null>(null)

  const [currentMatch, setCurrentMatch] = useState<EventMatch>(matchList[0])
  const [currentTeam, setCurrentTeam] = useState(currentMatch?.blueTeams[0])

  const [currentEditor, setCurrentEditor] = useState<any>(null)

  const [teamToMatchNotes, setTeamToMatchNotes] = useState<{[key: string]: object}>({})

  const [completedInitialFetch, setCompletedInitialFetch] = useState(false)

  const [loading, setLoading] = useState(false)

  const changeTeamNotes = (team: TeamIdentifiers) => {
    if (!currentEditor) {
      return;
    }

    setTeamToMatchNotes((prev) => {
      return {
        ...prev,
        [currentTeam?.teamNumber]: currentEditor.getJSON()
      }
    });
    currentEditor.commands.clearContent()
    currentEditor.commands.setContent(teamToMatchNotes[team.teamNumber])
    setCurrentTeam(team);
  }

  const saveNotesAndChangeMatch = async(changeGroup: boolean, match?: EventMatch) => {
    if (!currentEditor) {
      return;
    }

    if (!completedInitialFetch) {
      toast.warn("No changes made because existing notes not loaded.")
      if (!changeGroup && !match) {
        setTeamToMatchNotes({})
        setMatchNotesDialogOpen(false)
      }
      return;
    }

    setLoading(true)

    let latestTeamToMatchNotes = {
      ...teamToMatchNotes,
      [currentTeam?.teamNumber]: currentEditor.getJSON()
    }

    // set team to null if content array is empty
    for (const teamNumber in latestTeamToMatchNotes) {
      const firstContentBlock = latestTeamToMatchNotes[teamNumber].content[0]

      if (latestTeamToMatchNotes[teamNumber].content.length === 1 && !("content" in firstContentBlock)) {
        latestTeamToMatchNotes[teamNumber] = null
      }
    }

    // check if previousNotesGroup is no longer in currentNotesGroups because of a leave
    if (previousNotesGroup) {
      const previousNotesGroupInCurrentNotesGroups = currentNotesGroups.find((group) => group.id === previousNotesGroup.id)

      if (!previousNotesGroupInCurrentNotesGroups) {
        currentEditor.setEditable(false)
        currentEditor.commands.clearContent()
        setPreviousNotesGroup(null)
        setCompletedInitialFetch(false)
        setLoading(false)
        return;
      }
    }

    try {
      const token = await getToken()

      const response = await fetch(`/api/seasons/${eventObject?.season.id}/notes`, {
        method: "POST",
        body: JSON.stringify({
          notesGroupId: previousNotesGroup?.id,
          notes: latestTeamToMatchNotes
        }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error);
        setLoading(false)
        return;
      }

      currentEditor.setEditable(false)
      currentEditor.commands.clearContent()
      setCompletedInitialFetch(false)

      if (match) {
        setCurrentMatch(match)
      } else if (changeGroup) {
        // do nothing
      } else {
        setMatchNotesDialogOpen(false)
        setTeamToMatchNotes({})
      }

      setLoading(false)
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving team notes.");
      setLoading(false)
    }
  }

  const getMatchTeamNotes = async(teams: TeamIdentifiers[]) => {
    setLoading(true)

    const teamNotes: { [key: string]: object } = {}

    const searchParams = new URLSearchParams();

    for (const team of teams) {
      searchParams.append("teamNumber", team.teamNumber)
    }

    searchParams.append("notesGroupId", currentNotesGroup?.id.toString() || '')

    try {
      const token = await getToken()

      const response = await fetch(`/api/seasons/${eventObject?.season.id}/notes?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data.notes.length === 0) {
        setCompletedInitialFetch(true)
        setCurrentTeam(currentMatch?.blueTeams[0])
        setPreviousNotesGroup(currentNotesGroup)
        setTeamToMatchNotes(teamNotes)
        setLoading(false)
        return;
      }

      for (const teamNote of data.notes) {
        teamNotes[teamNote.teamNumber as string] = teamNote.note
      }

      setCurrentTeam(currentMatch?.blueTeams[0])
      setPreviousNotesGroup(currentNotesGroup)
      setTeamToMatchNotes(teamNotes)
      setCompletedInitialFetch(true)
      setLoading(false)
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching team notes.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentMatch && matchNotesDialogOpen) {
      getMatchTeamNotes([...currentMatch.blueTeams, ...currentMatch.redTeams])
    }
  }, [currentMatch, matchNotesDialogOpen])

  useEffect(() => {
    if (!currentEditor) {
      return;
    }

    if (currentTeam && completedInitialFetch) {
      if (teamToMatchNotes[currentTeam.teamNumber]) {
        currentEditor.commands.setContent(teamToMatchNotes[currentTeam.teamNumber])
      }
      currentEditor.setEditable(true)
    }
  }, [teamToMatchNotes, completedInitialFetch, currentTeam, currentEditor, matchNotesDialogOpen])

  useEffect(() => {
    if (completedInitialFetch && matchNotesDialogOpen) {
      saveNotesAndChangeMatch(true).then(() => {
        getMatchTeamNotes([...currentMatch.blueTeams, ...currentMatch.redTeams])
      })
    }
  }, [currentNotesGroup])

  // useEffect(() => {
  //   console.log({
  //     currentMatch,
  //     currentTeam,
  //     currentEditor,
  //     teamToMatchNotes,
  //     completedInitialFetch,
  //     loading,
  //     previousNotesGroup,
  //     currentNotesGroup,
  //     matchNotesDialogOpen
  //   })
  // }, [currentMatch, currentTeam, currentEditor, teamToMatchNotes, completedInitialFetch, loading, previousNotesGroup, currentNotesGroup, matchNotesDialogOpen])

  return (
    <AlertDialog.Root
      open={matchNotesDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-50 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[650px] w-[350px] max-h-full translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[22px] focus:outline-none">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Match Notes
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={`flex flex-col ${loading ? "animate-pulse" : ""}`}>
              <div className="flex flex-col matchNotesDialogTipTap max-h-[300px]">
                <h1 className="mb-3 text-2xl font-semibold text-neutral-200">
                  {currentMatch?.name} - {currentTeam?.teamNumber}
                </h1>
                <Tiptap setEditor={setCurrentEditor} />
                <MatchResultNavigator
                  className="mt-5"
                  key={currentMatch?.id}
                  {...currentMatch}
                  teamSetter={changeTeamNotes}
                />
                <div className="mt-2 flex flex-row justify-center">
                  <button
                    className="flex h-5 w-10 items-center justify-center text-xl font-semibold text-white"
                    onClick={() => {
                      const currentMatchIndex = matchList.indexOf(currentMatch)
                      if (currentMatchIndex !== 0) {
                        saveNotesAndChangeMatch(false, matchList[currentMatchIndex - 1])
                      }
                    }}
                  >
                    <BsArrowReturnLeft />
                  </button>
                  {/* text saying match browser */}
                  <div className="mx-5 flex flex-col items-center justify-center">
                    <h1 className="text-xs font-semibold text-neutral-200">
                      Match Browser
                    </h1>
                  </div>
                  <button
                    className="flex h-5 w-10 items-center justify-center text-xl font-semibold text-white"
                    onClick={() => {
                      const currentMatchIndex = matchList.indexOf(currentMatch)
                      if (currentMatchIndex !== matchList.length - 1) {
                        saveNotesAndChangeMatch(false, matchList[currentMatchIndex + 1])
                      }
                    }}
                  >
                    <BsArrowReturnRight />
                  </button>
                </div>
                <NotesGroupComponent/>
              </div>
            </div>
          </AlertDialog.Description>
          <div className="mt-auto flex justify-between">
            <AlertDialog.Action asChild>
              <button
                className="mt-4 ml-auto h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50"
                onClick={(e) => saveNotesAndChangeMatch(false)}
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