import { create } from 'zustand';

//* 메뉴 상태
type MenuState = 'open' | 'close' | 'hide';

//* 메뉴 상태
interface MainMenuState {
    // state
    state: MenuState;       // 메뉴 상태

    isOpen: () => boolean;  // true: open, false: close
    isHide: () => boolean;  // true: open, false: close
    menuOpen: ()=>void;     // 메뉴 열기
    menuClose: ()=>void;    // 메뉴 닫기
    menuHide: ()=>void;     // 메뉴 숨김
}

// 메인 메뉴 Store
export const useMainMenuStore = create<MainMenuState>((set, get) => ({
    state: 'open',

    isOpen: () =>get().state === 'open',
    isHide: () =>get().state === 'hide',

    menuOpen: () => { set({state: 'open'}); },
    menuClose: () => { set({state: 'close'}); },
    menuHide: () => { set({state: 'hide'}); },
}));