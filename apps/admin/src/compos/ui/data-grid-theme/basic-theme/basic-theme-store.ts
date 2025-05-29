import { storeContext } from '@/utils';
import { MRT_ColumnDef, MRT_ColumnFilterFnsState, MRT_PaginationState, MRT_SortingState, MRT_TableOptions } from 'mantine-react-table';
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

    gobalSearch?: string;                       // 검색 키워드
    colFilters: MRT_ColumnFilterFnsState[];     // 컬럼 필터
    colSorting: MRT_SortingState[];             // 컬럼 정렬

    pagination: MRT_PaginationState;            // 페이지네이션
    rowCount: number;                           // Row 데이터 총 갯수

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

    setGobalSearch: (                            // 검색 키워드 설정
        gobalSearch: string                      // - 검색 키워드 값
    ) => void;

    setColFilters: (                             // 컬럼 필터 설정
        colFilters: MRT_ColumnFilterFnsState[]   // - 컬럼 필터 값
    ) => void;

    setColSorting: (                             // 컬럼 정렬 설정
        colSorting: MRT_SortingState[]           // - 컬럼 정렬 값
    ) => void;

    setPagination: (                             // 페이지 설정
        pagination: MRT_PaginationState          // - 페이징 값
    ) => void;

    setRowCount: (                               // Row 데이터 총 갯수
        rowCount: number                         // - 총 갯수 값
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

        gobalSearch: undefined,
        colFilters: [],
        colSorting: [],

        pagination: {
            pageIndex: 0,
            pageSize: 10,
        },
        rowCount: 0,

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

        //* 검색 키워드 설정
        setGobalSearch: (gobalSearch) => set({ gobalSearch }),

        //* 컬럼 필터 설정
        setColFilters: (colFilters) => set({ colFilters }),
        
        //* 컬럼 정렬 설정
        setColSorting: (colSorting) => set({ colSorting }),

        //* 페이지 설정
        setPagination: (pagination) => set({ pagination }),

        //* row 총 갯수 설정
        setRowCount: (rowCount) => set({ rowCount }),
    }))
}


//* 기본 그리드 이벤트 State
export interface BasicGridEventState {
    // state ----
    evKey: string|null;                         // 이벤트 키
    evData: any;                                // 이벤트 전달 데이터

    // action ----
    sendEvent: (                                // 이벤트 전달 설정
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


//*-- 독립 state 생성
// 기본 그리드
export const {
    Provider: GridProvider,
    useStore: useGridStore
} = storeContext<BasicGridState<any>>(createBasicGridStore);

// 이벤트 용
export const {
    Provider: GridEventProvider,
    useStore: useGridEventStore
} = storeContext<BasicGridEventState>(createBasicGridEvntsStore);