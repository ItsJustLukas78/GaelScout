import { create } from 'zustand'
import { NotesGroup } from '@/app/types'

interface GlobalState {
  currentNotesGroup: NotesGroup | null;
  currentNotesGroups: NotesGroup[];
  currentPhoneNumber: string | null;
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => void;
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => void;
  setCurrentPhoneNumber: (phoneNumber: string | null) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  currentNotesGroup: null,
  currentNotesGroups: [],
  currentPhoneNumber: null,
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => set(() => ({ currentNotesGroup: notesGroup })),
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => set(() => ({ currentNotesGroups: notesGroups })),
  setCurrentPhoneNumber: (phoneNumber: string | null) => set(() => ({ currentPhoneNumber: phoneNumber })),
}))