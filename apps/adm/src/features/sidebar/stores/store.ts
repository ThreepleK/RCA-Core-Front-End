// ✅ store.ts
import { create } from 'zustand';

interface EventStore {
eKey: string;
sendEvent: (value: string) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  eKey: null,
  sendEvent: (value) => set({ eKey: value }),
}));