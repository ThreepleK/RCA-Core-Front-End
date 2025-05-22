import { ReactNode } from 'react';
import { create } from 'zustand';

type ShowCont = string | ReactNode | null;

//* 생성성 모달 State
export interface CreateModalState {
    // state ----
    isOpen: boolean;                        // 모달 보임 여부
    isMore: boolean;                        // More check 여부
    isError: boolean;                        // validate 여부
    title: ShowCont;                        // 보여줄 제목
    content: ShowCont;                      // 보여줄 내용
    btnLabel: ShowCont;                     // 버튼 라벨
    feedback: ()=>void;                     // 확인 피드백

    // action ----
    setOpen: (is: boolean) => void;         // 열림 설정
    setMore?: (is: boolean) => void;         // more check 설정
    setValue?: (value: string) => void;     // required 옵션 설정
    setContent: (                           // 보여줄 내용
        title: ShowCont,                    // 제목
        content: ShowCont,                  // 본문
        btnLabel: ShowCont,                 // 버튼 라벨
        feedback: ()=>void,                 // 피드백 콜백
    ) => void;
}

// 확인 모달 store
export const useCreateModalStore = create<CreateModalState>((set, _) => ({
    isOpen: false,
    isMore: false,
    isError: true,
    title: '',
    content: null,
    btnLabel: null,
    feedback: ()=>{},

    //* 열림 설정
    setOpen: ( is ) => {
        set({isOpen: is});
    },

    setMore: ( is ) => {
        set({isMore: is});
    },

    setValue: ( is ) => {
        if(is === '') {
            set({isError: true}); 
        } else {
            set({isError: false});
        }
    },

    //* 보여줄 내용 설정
    setContent: ( title, content, btnLabel, feedback ) => {
        set({ title, content, btnLabel, feedback });
    }
}));