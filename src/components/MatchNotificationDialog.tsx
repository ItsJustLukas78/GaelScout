"use client"
import React, { useEffect, useState } from "react";
import {toast} from "react-toastify";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {Division, Event, EventMatch, NotesGroup, TeamProfile} from "@/app/types";
import Tiptap from "@/components/Tiptap";
import {useAuth} from "@clerk/nextjs";
import NotesGroupComponent from "@/components/NotesGroupComponent";
import {useGlobalStore} from "@/state/globalState";
import { phone } from 'phone';

interface MatchNotificationDialogProps {
  matchNotificationDialogOpen: boolean;
  setMatchNotificationDialogOpen: (open: boolean) => void;
  currentNotificationMatch: EventMatch | null;
  eventObject: Event | null;
  currentDivision: Division | null;
}

export default function MatchNotificationDialog(
  {
    matchNotificationDialogOpen,
    setMatchNotificationDialogOpen,
    currentNotificationMatch,
    eventObject,
    currentDivision
  }: MatchNotificationDialogProps
) {
  const { getToken } = useAuth();

  const currentPhoneNumber = useGlobalStore((state) => state.currentPhoneNumber);
  const setCurrentPhoneNumber = useGlobalStore((state) => state.setCurrentPhoneNumber);

  const createNotification = async () => {
    try {
      const token = await getToken()

      if (!token) {
        toast.error("Your session has expired. Please refresh the page.")
        return;
      }

      if (!eventObject || !currentDivision || !currentNotificationMatch) {
        toast.error("Something went wrong. Please refresh the page.")
        return;
      }

      if (!currentPhoneNumber) {
        toast.error("Please enter a phone number.")
        return;
      }

      const validatedPhoneNumber = phone(currentPhoneNumber);

      if (!validatedPhoneNumber || !validatedPhoneNumber.isValid) {
        toast.error("Please enter a valid phone number.")
        return;
      }

      const response = await fetch(`/api/events/${eventObject?.id}/${currentDivision?.id}/requestNotification`, {
        method: "POST",
        body: JSON.stringify({
          matchnum: currentNotificationMatch?.matchnum,
          round: currentNotificationMatch?.round,
          instance: currentNotificationMatch?.instance,
          phoneNumber: validatedPhoneNumber.phoneNumber
        }),
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Notification request sent!")
      setMatchNotificationDialogOpen(false);
    } catch (error) {
      console.log(error);
      setMatchNotificationDialogOpen(false);
    }
  }


  return (
    <AlertDialog.Root
      open={matchNotificationDialogOpen}
      onOpenChange={(open) => {}}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-50 bg-black opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="flex flex-col z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] min-h-[300px] w-[300px] 2xs:min-h-[450px] 2xs:w-[350px] max-h-full translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-neutral-800 p-[22px] focus:outline-none overflow-y-auto">
          <AlertDialog.Title className="mb-5 text-xl font-bold">
            Match Notification
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className={`flex flex-col`}>
              <div className="flex flex-col max-h-[300px]">
                <h1 className="mb-5 text-2xl font-semibold text-neutral-200">
                  Setup a notification for {currentNotificationMatch?.name}
                </h1>
                <p className="mb-5 text-sm font-semibold text-neutral-200">
                  You will be notified ~4 matches before {currentNotificationMatch?.name} is scheduled to start.
                </p>
                <p className="mb-2 text-md font-semibold text-neutral-200">
                  Phone Number:
                </p>
                <input
                  className="mb-5 text-xl font-semibold text-neutral-200 bg-neutral-700 rounded-md h-10 px-2"
                  value={currentPhoneNumber || ""}
                  onChange={(e) => setCurrentPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </AlertDialog.Description>
          <div className="mt-auto">
            <AlertDialog.Action asChild>
              <div className="justify-between flex flex-row">
                <button
                  className="h-8 w-28 whitespace-nowrap rounded-md bg-red-300 text-xl font-semibold text-black disabled:opacity-50"
                  onClick={(e) => setMatchNotificationDialogOpen(false)}
                  disabled={false}
                >
                  Cancel
                </button>
                <button
                  className="h-8 w-28 whitespace-nowrap rounded-md bg-green-300 text-xl font-semibold text-black disabled:opacity-50"
                  onClick={(e) => createNotification()}
                  disabled={false}
                >
                  Create
                </button>
              </div>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}