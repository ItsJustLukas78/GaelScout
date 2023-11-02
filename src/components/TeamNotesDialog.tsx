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
import {useAuth} from "@clerk/nextjs";

export default function TeamNotesDialog({ teamNotesDialogOpen, currentNotesTeam, seasonId, setTeamNotesDialogOpen }: { teamNotesDialogOpen: boolean, currentNotesTeam: TeamProfile | null, seasonId: number, setTeamNotesDialogOpen: (open: boolean) => void }) {
  const { getToken } = useAuth();

  const [currentEditor, setCurrentEditor] = useState<any>(null)

  const [currentTeamNotes, setCurrentTeamNotes] = useState<object | null>(null)
  const [loadedNotesWasEmpty, setLoadedNotesWasEmpty] = useState<boolean>(false)

  const [completedInitialFetch, setCompletedInitialFetch] = useState(false)

  const [loading, setLoading] = useState(true)

  const saveNotes = () => {
    if (!currentEditor || !currentNotesTeam) {
      toast.warn("No changes made because the editor or team did not load.")
      setCurrentTeamNotes(null)
      setCompletedInitialFetch(false)
      setLoadedNotesWasEmpty(false)
      setTeamNotesDialogOpen(false)

      if (currentEditor) {
        currentEditor.setEditable(false)
      }

      return;
    }

    if (!completedInitialFetch) {
      toast.warn("No changes made because existing notes not loaded.")
      currentEditor.setEditable(false)
      setCurrentTeamNotes(null)
      setCompletedInitialFetch(false)
      setLoadedNotesWasEmpty(false)
      setTeamNotesDialogOpen(false)
      return;
    }

    setLoading(true)

    let notes = currentEditor.getJSON()

    if (notes.content.length === 1 && !("content" in notes.content[0])) {
      notes = null

      if (loadedNotesWasEmpty) {
        currentEditor.setEditable(false)
        setCurrentTeamNotes(null)
        setCompletedInitialFetch(false)
        setLoadedNotesWasEmpty(false)
        setTeamNotesDialogOpen(false)
        return;
      }
    }

    const teamNumber: string = currentNotesTeam.teamNumber

    const notesPostBody: {[key: string]: object} = {}

    notesPostBody[teamNumber] = notes

    console.log(notesPostBody)

    getToken().then((token) => {
      fetch(`/api/seasons/${seasonId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          notes: notesPostBody
        }),
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((response) => {
        response.json().then((data) => {
          console.log({data})
          if (data.error) {
            toast.error(data.error);
            setLoading(false);
            return;
          }

          currentEditor.setEditable(false)
          currentEditor.commands.clearContent();
          setCurrentTeamNotes(null);
          setCompletedInitialFetch(false);
          setLoadedNotesWasEmpty(false);
          setTeamNotesDialogOpen(false);
        }).catch((error) => {
          console.log(error);
          toast.error("An error occurred while saving team notes.");
          setLoading(false);
        });
      }).catch((error) => {
        console.log(error);
        toast.error("An error occurred while saving team notes.");
        setLoading(false);
      });
    }).catch((error) => {
      console.log(error);
      toast.error("An error occurred while saving team notes.");
      setLoading(false);
    });
  }

  const getTeamNotes = () => {
    if (!currentNotesTeam) {
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.append("teamNumber", currentNotesTeam.teamNumber)

    getToken().then((token) => {
      fetch(`/api/seasons/${seasonId}/notes?${searchParams.toString()}`, {
        method: "GET",
      }).then((response) => {
        response.json().then((data) => {
          if (data.error) {
            toast.error(data.error);
            return;
          }

          setCompletedInitialFetch(true)
          setLoading(false)

          if (data.notes.length === 0) {
            setLoadedNotesWasEmpty(true)
            return;
          }

          setCurrentTeamNotes(data.notes[0].note)
        }).catch((error) => {
          console.log(error);
          toast.error("An error occurred while fetching team notes.");
        });
      }).catch((error) => {
        console.log(error);
        toast.error("An error occurred while fetching team notes.");
      });
    }).catch((error) => {
      console.log(error);
      toast.error("An error occurred while fetching team notes.");
    })
  }

  useEffect(() => {
    if (currentNotesTeam && teamNotesDialogOpen) {
      getTeamNotes()
    }
  }, [currentNotesTeam, teamNotesDialogOpen])

  useEffect(() => {
    if (currentEditor) {
      if (currentTeamNotes && completedInitialFetch) {
        currentEditor.commands.setContent(currentTeamNotes)
        currentEditor.setEditable(true)
      } else if (!currentTeamNotes && completedInitialFetch) {
        currentEditor.commands.clearContent()
        currentEditor.setEditable(true)
      }}
  }, [currentTeamNotes, completedInitialFetch, currentEditor])

  return (
    <AlertDialog.Root
      open={teamNotesDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-40 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[650px] min-w-[350px] max-h-full translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Match Notes
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={`flex flex-col ${loading ? "animate-pulse" : ""}`}>
              <div className="flex flex-col teamNotesDialogTipTap max-h-[300px]">
                <h1 className="mb-5 text-2xl font-semibold text-neutral-200">
                  {currentNotesTeam?.teamNumber}
                </h1>
                <Tiptap setEditor={setCurrentEditor} />
              </div>
            </div>
          </AlertDialog.Description>
          <div className="mt-auto flex justify-between">
            <AlertDialog.Action asChild>
              <button
                className="mt-4 ml-auto h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50"
                onClick={(e) => saveNotes()}
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