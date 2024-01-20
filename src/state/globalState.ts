import { create } from 'zustand'
import { NotesGroup } from '@/app/types'

interface GlobalState {
  currentNotesGroup: NotesGroup | null;
  currentNotesGroups: NotesGroup[];
  currentUsersTeamNumber: string | null;
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => void;
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => void;
  setUsersCurrentTeamNumber: (teamNumber: string | null) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  currentNotesGroup: null,
  currentNotesGroups: [],
  currentUsersTeamNumber: null,
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => set(() => ({ currentNotesGroup: notesGroup })),
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => set(() => ({ currentNotesGroups: notesGroups })),
  setUsersCurrentTeamNumber: (teamNumber: string | null) => set(() => ({ currentUsersTeamNumber: teamNumber })),
}))