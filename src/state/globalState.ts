import { create } from 'zustand'
import { NotesGroup } from '@/app/types'
import { Event } from '@/app/types'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GlobalState {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  colorVariableValues: {[key: string]: {hue: number, saturation: number, value: number}};
  setColorVariableValues: (colorVariableValues: {[key: string]: {hue: number, saturation: number, value: number}}) => void;
  customThemeEnabled: boolean;
  setCustomThemeEnabled: (enabled: boolean) => void;
  harmony: "triad" | "tetradic" | "analogous" | "square";
  setHarmony: (harmony: "triad" | "tetradic" | "analogous" | "square") => void;
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
      colorVariableValues: {
        "--color-primary": {hue: 0, saturation: 0, value: 14.9},
        "--color-primary-hover": {hue: 0, saturation: 0, value: 32.2},
        "--color-secondary": {hue: 0, saturation: 0, value: 25.1},
        "--color-secondary-hover": {hue: 0, saturation: 0, value: 32.2},
        "--color-tertiary": {hue: 0, saturation: 0, value: 100},
        "--color-tertiary-hover": {hue: 25.5, saturation: 3.9, value: 66.3}
      },
      setColorVariableValues: (colorVariableValues: {[key: string]: {hue: number, saturation: number, value: number}}) => set({ colorVariableValues: colorVariableValues }),
      customThemeEnabled: false,
      setCustomThemeEnabled: (enabled: boolean) => set({ customThemeEnabled: enabled }),
      harmony: "triad",
      setHarmony: (harmony: "triad" | "tetradic" | "analogous" | "square") => set({ harmony: harmony }),
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