import { ReactNode } from 'react';
import { create } from 'zustand';

type ShowCont = string | ReactNode | null;

//* State
export interface SelectedMemberState {
    // state ----
    data: any;                        // 그리드에서 선택한 데이터
    deletedData: any;                // selected area 에서 삭제된 데이터
    isClear: boolean;                // 그리드에서 선택한 데이터 초기화 여부
    feedback: ()=>void;                     // 확인 피드백

    // action ----
    setClear: (is: boolean) => void;         // 그리드에서 선택한 데이터 초기화
    setSelectedRow: (value: any) => void;         // 그리드 데이터 변경
    setDeletedRow: (value: any) => void;         // 선택된 데이터 변경
}

// store
export const useSelectedRowStore = create<SelectedMemberState>((set, _) => ({
    data: null,
    deletedData: null,
    isClear: false,
    feedback: ()=>{},

    //* 그리드에서 선택된 데이터
    setSelectedRow: ( value ) => {
        set({data: value});
    },

     //* selected area 에서 삭제된 데이터
     setDeletedRow: ( value ) => {
        set({deletedData: value});
    },

    //* 그리드에서 선택한 데이터 초기화
    setClear: ( is ) => {
        set({isClear: is});
    },
}));