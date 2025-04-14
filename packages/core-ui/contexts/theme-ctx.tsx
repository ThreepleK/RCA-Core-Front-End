import { createContext, useContext, useState } from "react"
import { MantineProvider } from '@mantine/core';

// 테마 타입
type Theme = 'dark' | 'light';

// value로 전달 할 상태 값
type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ProviderCtx = createContext<ThemeProviderState>({
    theme: 'light',
    setTheme: () => null
});

/**
 * 테마 Provider
 */
export function ThemeProvider({ children, defaultTheme='light', storageKey='mantine-ui-theme' }: {
    children: React.ReactNode,
    defaultTheme?: Theme,
    storageKey?: string,
}) {
    const [_theme, _setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) || defaultTheme) as Theme);

    const setTheme = (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        _setTheme(theme);
    };
    
    const value = {
        theme: _theme,
        setTheme: setTheme,
    };
    
    return <ProviderCtx.Provider value={value}>
        <MantineProvider forceColorScheme={_theme}>
            {children}
        </MantineProvider>
    </ProviderCtx.Provider>
}


/**
 * 테마 설정
 */
export const useTheme = () => {
    const context = useContext(ProviderCtx)
  
    if (context === undefined){
        throw new Error('useTheme must be used within a ThemeProvider')
    }
  
    return context
}
  