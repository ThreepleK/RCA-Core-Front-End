import { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { ReactNode } from 'react';
import { create } from 'zustand';

//* 일반적으로 사용될 컨텐츠 기본 값
type ContItem = string | ReactNode;

//* 그리드 컬럼에 사용될 Action 버튼
type ActionColBtns = {[key: string]: ContItem};

//* 기본 그리드 State
export interface BasicGridState<T> {
    // state ----
    columns: MRT_ColumnDef<T>[];                // 그리드 컬럼
    gridOpts?: MRT_TableOptions<T>|null;        // 그리드 옵션
    gridData: any[];                            // 그리드 데이터
    actionsCols: ActionColBtns|null;            // 컬럼에 사용될 액션 버튼
    isLoading: boolean;                         // 그리드 로딩 여부

    // action ----
    setColumns: (                               // 컬럼 설정
        columns: MRT_ColumnDef<T>[]             // - 컬럼 값
    ) => void;

    setGridOpts: (                              // 그리드 옵션
        gridOpts: MRT_TableOptions<T>           // - 옵션 설정 값
    ) => void;

    setGridData: (                              // 그리드 데이터
        gridData: any[]                         // - 데이터 값
    ) => void;

    setActionsCols: (                           // 컬럼에 사용될 액션 버튼 설정
        buttons: ActionColBtns                  // - 컬럼에 사용될 액션 버튼 정보
    ) => void;

    setIsLoading: (                             // 그리드 로딩 설정
        isLoading: boolean                      // - 로딩 여부 값
    ) => void;
}

//* 기본 그리드 제어
export const createBasicGridStore = () => {
    return create<BasicGridState<any>>((set, get) => ({
        columns: [],
        gridOpts: null,
        gridData: [],
        actionsCols: null,
        isLoading: true,

        //* 컬럼 값 설정
        setColumns: (columns) => set({ columns }),

        //* 컬럼 값 설정
        setGridOpts: (gridOpts) => set({ gridOpts }),

        //* 데이터 값 설정
        setGridData: (gridData) => set({
            gridData: [...gridData]
        }),

        //* 컬럼에 사용될 액션 버튼 설정
        setActionsCols: (buttons) => {
            set({
                actionsCols: {...buttons}
            });
        },

        //* 로딩 설정
        setIsLoading: (isLoading) => set({ isLoading }),
    }))
}


//* 기본 그리드 State
export interface BasicGridEventState {
    // state ----
    evKey: string|null;                         // 이벤트 키
    evData: any;                                // 이벤트 전달 데이터

    // action ----
    sendEvent: (                                 // 이벤트 전달 설정
        evKey: string,                          // - 이벤트 키
        evData: any                             // - 전달 데이터
    ) => void;
}

// 이벤트 제어 용
export const createBasicGridEvntsStore = () => {
    return create<BasicGridEventState>((set, _) => ({
        evKey: null,
        evData: null,

        //* 이벤트 설정
        sendEvent: (evKey, evData) => {
            set({ evKey, evData });
        },
    }))
};