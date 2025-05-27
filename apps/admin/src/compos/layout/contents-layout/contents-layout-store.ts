import { FC, ReactNode } from 'react';
import { create } from 'zustand';

//* 컨텐츠 타입
export type Content = string | ReactNode;

//* 기본 State
export interface ContLayoutState {
    // state ----
    titleLeft?: Content|null;                   // 타이틀 좌측 표기 컨텐츠
    titleRight?: Content|null;                  // 타이틀 우측 표기 컨텐츠
    sideArea?: Content|null;                    // 컨텐츠 사이드 영역 컨텐츠
    sideWidth?: string;                         // 컨텐츠 사이드 영역 넓이

    // action ----
    setTitleLeft: (cont: Content) => void;      // 타이틀 좌측 컨텐츠 설정
    setTitleRight: (cont: Content) => void;     // 타이틀 우측 컨텐츠 설정
    setSideWidth: (width: string) => void;      // 사이드 컨텐츠 넓이 설정
    setSideConts: (cont: Content) => void;      // 사이드 컨텐츠 내용 설정
    setSideArea: (                              // 사이드 컨텐츠 설정
        width: string,                          // - 넓이
        cont: Content,                          // - 컨텐츠
    ) => void;
}

//* 제어
export const createContLayoutStore = () => {
    return create<ContLayoutState>((set, _) => ({
        titleLeft: null,
        titleRight: null,
        sideArea: null,
        sideWidth: undefined,

        //* 타이틀 좌/우
        setTitleLeft: (cont) => set({ titleLeft: cont }),
        setTitleRight: (cont) => set({ titleRight: cont }),

        //* 사이드 컨텐츠 넓이 설정
        setSideWidth: (width: string) => set({ sideWidth: width }),
        //* 사이드 컨텐츠 내용 설정
        setSideConts: (cont: Content) => set({ sideArea: cont }),

        //* 사이드 영역
        setSideArea: (width, cont) => set({
            sideWidth: width,
            sideArea: cont
        }),
    }))
}