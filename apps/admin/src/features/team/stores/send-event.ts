import { create } from "zustand";

export interface useSendActionState {
    evKey: string|null;                     // 이벤트 키
    sendEvent: (evKey: string) => void;     // 이벤트 전달 함수
};

export interface useSendSelectedItemState {
    selectedItem: any|null;                     // 선택된 팀
    setSelectedItem: (value: any) => void;     // 이벤트 전달 함수
};

// 선택된 팀 전달용
export const useSendSelectedItem = create<useSendSelectedItemState>(set => ({
    selectedItem: null,
    setSelectedItem: (value: any) => set({selectedItem : value}),
}));

export interface useSendActionState {
    evKey: string|null;                     // 이벤트 키
    sendEvent: (evKey: string) => void;     // 이벤트 전달 함수
};
 
// 새로 만들어서 사용할 때
export const createSendAction = () => {
    return create<useSendActionState>(set => ({
        evKey: null,
        sendEvent: (evKey: string) => set({evKey}),
    }));
}

// 버튼 이벤트 전달 용
export const useGlobalSendAction = createSendAction();