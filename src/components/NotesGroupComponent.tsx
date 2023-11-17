import {HiSelector} from "react-icons/hi";
import {BsCheck} from "react-icons/bs";
import {useEffect, useState} from "react";
import { useGlobalStore } from "@/state/globalState";
import {NotesGroup} from "@/app/types";
import {toast} from "react-toastify";
import {useAuth} from "@clerk/nextjs";

export default function NotesGroupComponent() {
  const { getToken } = useAuth();

  const notesGroups = useGlobalStore((state) => state.currentNotesGroups);
  const currentNotesGroup = useGlobalStore((state) => state.currentNotesGroup);

  const setCurrentNotesGroup = useGlobalStore((state) => state.setCurrentNotesGroup);
  const setCurrentNotesGroups = useGlobalStore((state) => state.setCurrentNotesGroups);

  const [enteredJoinCode, setEnteredJoinCode] = useState<string>("")
  const [enteredNewGroup, setEnteredNewGroup] = useState<string>("")

  const [checkLeaveConfirmation, setCheckLeaveConfirmation] = useState<boolean>(false)

  const leaveNotesGroup = async() => {
    if (!currentNotesGroup) {
      toast.warn("No valid group selected")
      return;
    }

    if (checkLeaveConfirmation) {
      try {
        setCheckLeaveConfirmation(false)

        const token = await getToken()

        const response = await fetch("/api/notesGroups/leave", {
          method: "POST",
          body: JSON.stringify({
            notesGroupId: currentNotesGroup.id,
          }),
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.error) {
          toast.error(data.error)
        } else {
          setCurrentNotesGroup(null)
          setCurrentNotesGroups(notesGroups.filter((group) => group.id !== currentNotesGroup.id))
        }
      } catch (err) {
        toast.error(err as any)
      }
    } else {
      setCheckLeaveConfirmation(true)
      setTimeout(() => {
        setCheckLeaveConfirmation(false)
      }, 5000)
    }
  }

  const joinNotesGroup = async() => {
    if (enteredJoinCode === "") {
      toast.warn("Please enter a join code")
      return;
    }

    if (enteredJoinCode.length <= 0 || enteredJoinCode.length > 15 || !enteredJoinCode.startsWith('gaelscout')) {
      toast.warn("Invalid join code")
      setEnteredJoinCode("")
      return;
    }

    try {
      const token = await getToken()

      const response = await fetch("/api/notesGroups/join", {
        method: "POST",
        body: JSON.stringify({
          joinCode: enteredJoinCode,
        }),
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        const formatted: NotesGroup = {
          id: data.notesGroup.id,
          name: data.notesGroup.name,
          joinCode: data.notesGroup.joinCode,
        }
        setCurrentNotesGroup(formatted)
        setCurrentNotesGroups([...notesGroups, formatted])
      }
    } catch (err) {
      toast.error(err as any)
    }

    setEnteredJoinCode("")
  }

  const createNotesGroup = async() => {
    if (enteredNewGroup.length === 0 || enteredNewGroup.length > 40) {
      toast.warn("Invalid group name")
      setEnteredNewGroup("")
      return;
    }

    try {
      const token = await getToken()

      const response = await fetch("/api/notesGroups", {
        method: "POST",
        body: JSON.stringify({
          groupName: enteredNewGroup,
        }),
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        const formatted: NotesGroup = {
          id: data.notesGroup.id,
          name: data.notesGroup.name,
          joinCode: data.notesGroup.joinCode,
        }
        setCurrentNotesGroup(formatted)
        setCurrentNotesGroups([...notesGroups, formatted])
      }
    } catch (err) {
      toast.error(err as any)
    }

    setEnteredNewGroup("")
  }

  const getNotesGroups = async() => {
    try {
      const token = await getToken()

      const response = await fetch("/api/notesGroups", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        const formatted: NotesGroup[] = data.notesGroups.map((group: any) => {
          return {
            id: group.id,
            name: group.name,
            joinCode: group.joinCode,
          }
        })
        setCurrentNotesGroups(formatted)
      }
    } catch (err) {
      toast.error(err as any)
    }
  }

  useEffect(() => {
    getNotesGroups()
  } , [])

  return <>
    <div className="mt-5 flex flex-row justify-between rounded-xl bg-neutral-900 p-2 px-3 shadow-md shadow-neutral-900">
      <div className="relative flex flex-row items-center">
        <select
          className="appearance-none rounded-md bg-neutral-900 pr-6 text-sm text-neutral-200"
          value={currentNotesGroup ? currentNotesGroup.id : "me"}
          onChange={(e) => {
            if (e.target.value === "me") {
              setCheckLeaveConfirmation(false)
              setCurrentNotesGroup(null)
            } else {
              setCheckLeaveConfirmation(false)
              setCurrentNotesGroup(
                notesGroups.find((group : NotesGroup) => group.id === parseInt(e.target.value)) || null
              )
            }
          }}
        >
          <option key={-1} value="me">My Personal Notes</option>
          {notesGroups.map((group) => {
            return <option key={group.id} value={group.id}>{group.name}</option>
          })}
        </select>
        <HiSelector className="pointer-events-none absolute right-0 text-xl font-bold text-green-600" />
      </div>
      <button
        className="border-neutral-600 bg-neutral-900 text-center text-green-500 px-0.5 text-2xs pt-0.5 hover:text-green-400"
        onClick={() => {
          navigator.clipboard.writeText(currentNotesGroup ? currentNotesGroup.joinCode : "")
        }}
      >
        {currentNotesGroup ? currentNotesGroup.joinCode :  "N/A"}
      </button>
      <button
        className="text-sm text-red-600 hover:text-red-400"
        onClick={leaveNotesGroup}
      >
        {checkLeaveConfirmation ? "Sure?" : "Leave"}
      </button>
    </div>
    <div className="mt-5 flex flex-row gap-3 rounded-xl bg-neutral-900 p-2 px-2 shadow-md shadow-neutral-900">
      <div className="flex flex-row items-center">
        <input
          className="ml-auto w-28 border-b-2 border-neutral-600 bg-neutral-900 text-sm text-neutral-200 px-0.5"
          type="text"
          placeholder="Join Code"
          value={enteredJoinCode}
          onChange={(e) => {
            setEnteredJoinCode(e.target.value)
          }}
        />
        <button
          className="pl-1 text-xl font-bold text-green-600 hover:rotate-6 hover:text-green-400 disabled:opacity-50"
          disabled={enteredJoinCode === ""}
          onClick={joinNotesGroup}
        >
          <BsCheck />
        </button>
        <div className="mx-3 h-6 border-l-2 border-neutral-600"></div>
        <div className="relative flex flex-col">
          <input
            className="ml-auto w-28 border-b-2 border-neutral-600 bg-neutral-900 pr-7 text-sm text-neutral-200 pl-0.5"
            type="text"
            placeholder="New Group"
            maxLength={40}
            value={enteredNewGroup}
            onChange={(e) => {
              setEnteredNewGroup(e.target.value)
            }}
          />
          <p className="absolute text-right text-neutral-400 right-0.5 bottom-0.5 text-3xs">{enteredNewGroup.length}/40</p>
        </div>
        <button
          className="pl-1 text-xl font-bold text-green-600 hover:rotate-6 hover:text-green-400 disabled:opacity-50"
          disabled={enteredNewGroup === ""}
          onClick={createNotesGroup}
        >
          <BsCheck />
        </button>
      </div>
    </div>
  </>
}