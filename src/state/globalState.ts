import { create } from 'zustand'
import { NotesGroup } from '@/app/types'
import { Event } from '@/app/types'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GlobalState {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  currentNotesGroup: NotesGroup | null;
  currentNotesGroups: NotesGroup[];
  currentUsersTeamNumber: string | null;
  seasonToEvents: {[key: number]: Event[]};
  seasonToEventsAge : {[key: number]: Date};
  setCurrentNotesGroup: (notesGroup: NotesGroup | null) => void;
  setCurrentNotesGroups: (notesGroups: NotesGroup[]) => void;
  setUsersCurrentTeamNumber: (teamNumber: string | null) => void;
  setSeasonToEvents: (seasonId: number, events: Event[]) => void;
  setSeasonToEventsAge: (seasonId: number, age: Date) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist((set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (hasHydrated: boolean) => {
        set({
          _hasHydrated: hasHydrated
        });
      },
      currentNotesGroup: null,
      currentNotesGroups: [],
      currentUsersTeamNumber: null,
      seasonToEvents: {},
      seasonToEventsAge: {},
      setCurrentNotesGroup: (notesGroup: NotesGroup | null) => set({ currentNotesGroup: notesGroup }),
      setCurrentNotesGroups: (notesGroups: NotesGroup[]) => set({ currentNotesGroups: notesGroups }),
      setUsersCurrentTeamNumber: (teamNumber: string | null) => set({ currentUsersTeamNumber: teamNumber }),
      setSeasonToEvents: (seasonId: number, events: Event[]) => set({ seasonToEvents: {...get().seasonToEvents, [seasonId]: events} }),
      setSeasonToEventsAge: (seasonId: number, age: Date) => set({ seasonToEventsAge: {...get().seasonToEventsAge, [seasonId]: age} }),
    }), {
    name: 'global-state',
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: () => (state: any) => {
      state.setHasHydrated(true);
    }
  })
)