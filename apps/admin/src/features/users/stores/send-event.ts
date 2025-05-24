import { create } from "zustand";

export interface useSendActionState {
    evKey: string|null;                     // 이벤트 키
    sendEvent: (evKey: string) => void;     // 이벤트 전달 함수
};
 
// 버튼 이벤트 전달 용
export const useSendAction = create<useSendActionState>(set => ({
    evKey: null,
    sendEvent: (evKey: string) => set({evKey}),
}));