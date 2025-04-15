import { create } from 'zustand';

//* 테마
type Theme = 'light' | 'dark';

//* 테마 상태
interface ThemeState {
    // state
    theme: Theme;
    
    // action
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// 테마 Store
export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
    })),
    setTheme: (theme) => set({ theme }),
}));