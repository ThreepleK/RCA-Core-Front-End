import { create } from 'zustand';

type MenuItemType = 'label' | 'item';

// 메뉴 아이템
export type CtxMenuItem = {
    type: MenuItemType;
    label: string;
    value: string;
    icon?: any;
}

// 선택된 메뉴 콜백 처리
export type MenuSelectedCallback = ((selected: string) => void) | null | undefined;

//* 트리 우클릭 메뉴 State
export interface CtxMenuState {
    // state ----
    clientX: number;                        // 메뉴 X 좌표
    clientY: number;                        // 메뉴 Y 좌표
    isOpen: boolean;                        // 메뉴 열림 여부
    menuList: CtxMenuItem[];                // 보여줄 메뉴
    callback: MenuSelectedCallback;         // 선택된 메뉴 콜백 

    // action ----
    setOpen: (is: boolean) => void;         // 메뉴 열림 설정
    setPosition: (                          // 메뉴 좌표
        x: number,                          // - x 축
        y: number                           // - y 축축
    ) => void;

    setMenuList: (                          // 설정할 메뉴
        menuList: CtxMenuItem[],            // - 보여줄 메뉴
        callback: MenuSelectedCallback      // - 클릭 메뉴
    ) => void;
}

// 트리 우클릭 메뉴 store
export const useCtxMenuStore = create<CtxMenuState>((set, _) => ({
    clientX: 0,
    clientY: 0,
    isOpen: false,
    menuList: [],
    callback: null,

    //* 메뉴 갯수 설정
    setOpen: ( is ) => {
        set({isOpen: is});
    },

    //* 메뉴 좌표 설정
    setPosition: ( x, y ) => {
        set({ clientX: x, clientY: y });
    },

    //* 보여줄 메뉴 설정
    setMenuList: ( menuList, callback ) => {
        set({ menuList, callback });
    }
}));