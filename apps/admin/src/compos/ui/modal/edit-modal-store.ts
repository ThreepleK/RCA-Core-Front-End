import { ReactNode } from 'react';
import { create } from 'zustand';

type ShowCont = string | ReactNode | null;

//* 생성성 모달 State
export interface EditModalState {
    // state ----
    isOpen: boolean;                        // 모달 보임 여부
    isError: boolean;                        // validate 여부
    title: ShowCont;                        // 보여줄 제목
    content: ShowCont;                      // 보여줄 내용
    btnLabel: ShowCont;                     // 버튼 라벨
    defaultValue?: string;                     // default value
    editValue?: string;                     // edit value
    feedback: ()=>void;                     // 확인 피드백

    // action ----
    setOpen: (is: boolean) => void;         // 열림 설정
    setValue?: (value: string) => void;     // required 옵션 설정
    setContent: (                           // 보여줄 내용
        title: ShowCont,                    // 제목
        content: ShowCont,                  // 본문
        btnLabel: ShowCont,                 // 버튼 라벨
        feedback: ()=>void,                 // 피드백 콜백
        defaultValue?: string,                // default value
    ) => void;
}

// 확인 모달 store
export const useEditModalStore = create<EditModalState>((set, _) => ({
    isOpen: false,
    isError: true,
    title: '',
    content: null,
    btnLabel: null,
    defaultValue: '',
    editValue: '',
    feedback: ()=>{},

    //* 열림 설정
    setOpen: ( is ) => {
        set({isOpen: is});
    },

    setValue: ( value ) => {
        set({editValue: value});
    },

    //* 보여줄 내용 설정
    setContent: ( title, content, btnLabel, feedback ) => {
        set({ title, content, btnLabel, feedback });
    }
}));