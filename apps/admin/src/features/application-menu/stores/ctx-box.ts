import { create } from 'zustand';

//* 우클릭 box State
interface CtxBoxState {
    // state ----
    clientX: number;                        // X 좌표
    clientY: number;                        // Y 좌표
    isOpen: boolean;                        // 보임 여부
    content: any;                           // 보여줄 내용

    // action ----
    setOpen: (is: boolean) => void;         // 열림 설정
    setPosition: (                          // 좌표 설정
        x: number,                          // - x 축
        y: number                           // - y 축
    ) => void;

    setContent: (content: any) => void;     // 보여줄 내용
}

// 우클릭 box store
export const useCtxBoxStore = create<CtxBoxState>((set, _) => ({
    clientX: 0,
    clientY: 0,
    isOpen: false,
    content: null,

    //* 열림 설정
    setOpen: ( is ) => {
        set({isOpen: is});
    },

    //* 좌표 설정
    setPosition: ( x, y ) => {
        set({ clientX: x, clientY: y });
    },

    //* 보여줄 내용 설정
    setContent: ( content ) => {
        set({ content });
    }
}));