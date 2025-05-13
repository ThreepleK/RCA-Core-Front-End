import { create } from 'zustand';

//* Root 우클릭 메뉴 State
export interface RootCtxMenuState {
    // state ----
    clientX: number;                        // X 좌표
    clientY: number;                        // Y 좌표
    isOpen: boolean;                        // 보임 여부
    label: string;                          // 라벨

    // action ----
    open: (                                 // 열기
        x: number,                          // - x 축
        y: number,                          // - y 축
        label: string                       // - 라벨명
    ) => void;
    close: () => void;                      // 닫기
}

// Root 우클릭 메뉴 store
export const useRootCtxMenuStore = create<RootCtxMenuState>((set, _) => ({
    clientX: 0,
    clientY: 0,
    isOpen: false,
    label: '',

    //* 열림 설정
    open: ( x, y, label ) => {
        set({ isOpen: true, clientX: x, clientY: y, label });
    },
    close: () => {
        set({ isOpen: false });
    }
}));