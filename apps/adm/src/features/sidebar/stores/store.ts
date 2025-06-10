// ✅ store.ts
import { create } from 'zustand';

interface EventStore {
  eKey: string;
  sendEvent: (value: string) => void;
}

interface DataStore {
  data: any;
  core?: any,
  app?: any,
  custom?: any,
  sendData: (value: any) => void;
  sendCore?: (value: any) => void;
  sendApp?: (value: any) => void;
  sendCustom?: (value: any) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  eKey: null,
  sendEvent: (value) => set({ eKey: value }),
}));

export const useDataStore = create<DataStore>((set) => ({
  data: null,
  core: null,
  app: null, 
  custom: null,
  sendData: (value) => set({ data: value }),
  sendCore: (value) => set({ core: value }),  
  sendApp: (value) => set({ app: value }),
  sendCustom: (value) => set({ custom: value })
}));