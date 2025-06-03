import type { ReactNode } from 'react';
import { create } from 'zustand';

type ShowCont = string | ReactNode | null;
type ButtonItem = {
    [key: string]: ShowCont
};

//* 모달 State
export interface CommModalState {
    // state ----
    isOpen: boolean;                        // 모달 보임 여부
    isLoading: boolean;                     // 모달 로딩 여부
    title: ShowCont;                        // 보여줄 제목
    content: ShowCont;                      // 보여줄 내용
    buttons: ButtonItem;                    // 버튼
    bottomLeftSection: ShowCont;            // 하단 왼쪽 구간
    modalSize: any;                         // 모달 크기
    errMsg: ShowCont;                       // 에러 메시지

    feedback: (                             // 관련 버튼 피드백
        key: string,                        // 버튼 key
    ) => void;

    // action ----
    setOpen: (is: boolean) => void;         // -- 열림 설정
    setContent: (opts: {                    // -- 보여줄 내용
        title: ShowCont,                    // 제목
        content: ShowCont,                  // 본문
        buttons: ButtonItem,                // 버튼 라벨
        bottomLeftSection?: ShowCont,       // 하단 왼쪽 구간
        feedback: (                         // + 피드백 콜백
            key: string,                    //  버튼 key
        ) => void,
        size?: any,                         // 모달 크기
    }) => void;
    setOnlyContent: (                       // -- 모달 내용만
        content: ShowCont                   // 본문
    ) => void;
    setErrMsg: (                            // -- 에러 메시지 설정
        msg: ShowCont                       // 에러 메시지
    ) => void;
    setLoading: (is: boolean) => void;      // -- 로딩 설정
}

// 모달 store
export const useCommModalStore = create<CommModalState>((set, _) => ({
    isOpen: false,
    isLoading: false,
    title: '',
    content: null,
    buttons: {},
    bottomLeftSection: null,
    modalSize: 'md',
    errMsg: '',

    feedback: (key: string)=>{},

    //* 열림 설정
    setOpen: ( is ) => {
        set({
            isOpen: is,     // on/off
            errMsg: '',     // 에러 메시지 강제 제거
        });
    },

    //* 보여줄 내용 설정
    setContent: ({title, content, buttons, bottomLeftSection, feedback, size}) => {
        set({
            title, content, buttons, feedback,
            bottomLeftSection: bottomLeftSection ?? null,
            modalSize: size ?? 'md',
        });
    },

    //* 본문 내용만
    setOnlyContent: (content) => {
        set({content});
    },

    //* 에러 메시지
    setErrMsg: (msg) => {
        set({errMsg: msg});
    },

    //* 로딩 설정
    setLoading: (is) => {
        set({isLoading: is});
    }
}));