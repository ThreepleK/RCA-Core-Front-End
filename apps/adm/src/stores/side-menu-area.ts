import { create } from 'zustand';

type AreaType = 'open' | 'close';           // open: 열림 / close: 닫힘힘

//* side 메뉴 영역 State
interface SideMenuAreaState {
    // state ----
    currState: AreaType;                    // 사이드 메뉴 영역 상태

    // action ----
    setState: (type: AreaType)=>void;       // 사이드 메뉴 영역 상태 설정
}

// side 메뉴 열림 여부 제어
export const useSideMenuAreaStore = create<SideMenuAreaState>((set, get) => ({
    currState: 'open',

    setState: (type: AreaType) => {
        set({currState: type});
    },
}));