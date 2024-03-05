"use client"
import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {NotesGroup, TeamProfile} from "@/app/types";
import Tiptap from "@/components/Tiptap";
import {useAuth} from "@clerk/nextjs";
import NotesGroupComponent from "@/components/NotesGroupComponent";
import {useGlobalStore} from "@/state/globalState";

export default function TeamNotesDialog({ teamNotesDialogOpen, currentNotesTeam, seasonId, setTeamNotesDialogOpen }: { teamNotesDialogOpen: boolean, currentNotesTeam: TeamProfile | null, seasonId: number, setTeamNotesDialogOpen: (open: boolean) => void }) {
  const { getToken } = useAuth();

  const currentNotesGroup = useGlobalStore((state) => state.currentNotesGroup);

  const [previousNotesGroup, setPreviousNotesGroup] = useState<NotesGroup | null>(null)

  const [currentEditor, setCurrentEditor] = useState<any>(null)

  const [currentTeamNotes, setCurrentTeamNotes] = useState<object | null>(null)
  const [loadedNotesWasEmpty, setLoadedNotesWasEmpty] = useState<boolean>(false)

  const [completedInitialFetch, setCompletedInitialFetch] = useState(false)

  const [loading, setLoading] = useState(true)

  const saveNotes = async(changeGroup = false) => {
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
        setLoading(false)
        if (!changeGroup) {
          currentEditor.setEditable(false)
          setCurrentTeamNotes(null)
          setCompletedInitialFetch(false)
          setLoadedNotesWasEmpty(false)
          setTeamNotesDialogOpen(false)
          return;
        } else {
          currentEditor.setEditable(false)
          setCurrentTeamNotes(null)
          setCompletedInitialFetch(false)
          setLoadedNotesWasEmpty(false)
          return;
        }
      }
    }

    const teamNumber: string = currentNotesTeam.teamNumber

    const notesPostBody: {[key: string]: object} = {}

    notesPostBody[teamNumber] = notes

    try {
      const token = await getToken()

      const response = await fetch(`/api/seasons/${seasonId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          notesGroupId: previousNotesGroup?.id,
          notes: notesPostBody
        }),
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (changeGroup) {
        currentEditor.setEditable(false)
        currentEditor.commands.clearContent();
        setCurrentTeamNotes(null)
        setCompletedInitialFetch(false)
        setLoadedNotesWasEmpty(false)
        setLoading(false)
        return;
      }

      currentEditor.setEditable(false)
      currentEditor.commands.clearContent();
      setCurrentTeamNotes(null);
      setCompletedInitialFetch(false);
      setLoadedNotesWasEmpty(false);
      setTeamNotesDialogOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving team notes.");
      setLoading(false);
    }
  }

  const getTeamNotes = async() => {
    if (!currentNotesTeam) {
      return;
    }

    setLoading(true)

    const searchParams = new URLSearchParams();

    searchParams.append("teamNumber", currentNotesTeam.teamNumber)
    searchParams.append("notesGroupId", currentNotesGroup?.id.toString() || '')

    try {
      const token = await getToken()

      const response = await fetch(`/api/seasons/${seasonId}/notes?${searchParams.toString()}`, {
        method: "GET",
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      setCompletedInitialFetch(true)
      setLoading(false)
      setPreviousNotesGroup(currentNotesGroup)

      if (data.notes.length === 0) {
        setLoadedNotesWasEmpty(true)
        return;
      }

      setCurrentTeamNotes(data.notes[0].note)
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while loading team notes.");
      setLoading(false);
    }
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
  }, [currentTeamNotes, completedInitialFetch, currentEditor, currentNotesTeam])


  useEffect(() => {
    if (completedInitialFetch) {
      saveNotes(true).then(() => {
        getTeamNotes()
      })
    }
  } , [currentNotesGroup])

  return (
    <AlertDialog.Root
      open={teamNotesDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-50 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[550px] w-[300px] 2xs:min-h-[650px] 2xs:w-[350px] max-h-full translate-x-[-50%] translate-y-[-50%] rounded-[10px] bgColorPrimary p-[22px] focus:outline-none overflow-y-auto">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Team Notes
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={`flex flex-col ${loading ? "animate-pulse" : ""}`}>
              <div className="flex flex-col teamNotesDialogTipTap max-h-[300px]">
                <h1 className="mb-5 text-2xl font-semibold">
                  {currentNotesTeam?.teamNumber}
                </h1>
                <Tiptap setEditor={setCurrentEditor} />
                <NotesGroupComponent/>
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