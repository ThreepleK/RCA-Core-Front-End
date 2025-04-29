import { create } from 'zustand';

//* 페이지 이동 State
interface SideMenuState {
    // state ----
    max: number;                            // 메인 메뉴 총 갯수
    cnt: number;                            // 접힘 메뉴 갯수
    childSuccessCnt: number;                // 메뉴 처리 피드백 갯수
    isParent: boolean;                      // 부모 요청에 의한 여부

    isFolded: () => boolean;                // 부모 뮈치에서 메뉴 전체 접힘 상태 여부 [true: 접힘 / false: 펼침]
    isFoledChild: () => boolean|null;       // 자식 뮈치에서 메뉴 전체 접힘 요청 여부 [null: 요청 없음 / true: 접힘 / false: 펼침]

    // parent action ----
    setMenuTotalCnt: (total: number) => void;   // 메인 메뉴 총 갯수 설정
    setAllFold: () => void;                     // 전체 접힘
    setAllUnFold: () => void;                   // 전체 펼침
    
    // children action ----
    setFold: () => void;                        // 메뉴 하나 접힘 (카운트+)
    setUnFold: () => void;                      // 메뉴 하나 펼침 (카운트-)
    childSuccess: () => void;                   // 전체 메뉴 토글 시 처리 피드백 용
}

// 메뉴 접힘 여부를 제어 하기 위한 스토어 설정
export const useSideMenuStore = create<SideMenuState>((set, get) => ({
    max: 1,
    cnt: 0,
    childSuccessCnt: 0,
    isParent: false,

    //* 메뉴 갯수 설정
    setMenuTotalCnt: (total: number) => {
        set({max: total});
    },

    //* 메뉴 전체 접힘 상태
    isFolded: () => {
        return get().cnt === get().max;
    },

    //* setAllFold, setAllUnFold를 통해 하위 메뉴가 제어하기 위한 상태
    isFoledChild: () => {
        if( !get().isParent ){ return null; }
        return get().cnt === get().max;
    },
    
    //* 접힘 처리
    setFold: () => {
        const cnt = get().cnt;
        set({cnt: cnt + 1});
    },
    //* 펼침 처리
    setUnFold: () => {
        const cnt = get().cnt;
        set({cnt: cnt - 1});
    },
    //* 전체 접힘
    setAllFold: () => {
        const max = get().max;
        set({
            cnt: max,
            isParent: true,
            childSuccessCnt: 0,
        });
    },
    //* 전체 펼침
    setAllUnFold: () => {
        set({
            cnt: 0,
            isParent: true,
            childSuccessCnt: 0,
        });
    },
    //* 하위 항목 처리
    childSuccess: () => {
        const max = get().max;
        const cCount = get().childSuccessCnt + 1;

        if( max <= cCount ){
            set({
                isParent: false,
                childSuccessCnt: 0,
            });
        } else {
            set({
                childSuccessCnt: cCount,
            });
        }
    },
}));