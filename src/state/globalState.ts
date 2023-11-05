import { create } from 'zustand'
import { NotesGroup } from '@/app/types'

interface GlobalState {
  currentNotesGroup: NotesGroup | null;
  currentNotesGroups: NotesGroup[];
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => void;
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  currentNotesGroup: null,
  currentNotesGroups: [],
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => set(() => ({ currentNotesGroup: notesGroup })),
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => set(() => ({ currentNotesGroups: notesGroups })),
}))