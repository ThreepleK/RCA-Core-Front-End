import { create } from 'zustand';

//* 페이지 이동 State
interface PageMoveState {
    // state
    currPath: string;                       // 페이지 이동경로
    navigateFN: any;                        // react-router-dom의 useNavigate

    setNavigate: (nav: any) => void;        // useNavigate 함수 설정
    pageMove: (page: string) => void;       // 페이지 이동
}

// RouterDom Store
export const usePageMoveStore = create<PageMoveState>((set, get) => ({
    currPath: '',
    navigateFN: null,
    setNavigate: (nav: any) => set({navigateFN: nav}),
    pageMove: (page: string) => {
        const navigate = get().navigateFN;

        // 아직 설정된 함수 가 없으면 처리 안함
        if( navigate === null ){ return; }

        // 이동한 페이지 설정, router 통한 페이지 이동처리
        set({currPath: page});
        navigate(page);
    },
}));