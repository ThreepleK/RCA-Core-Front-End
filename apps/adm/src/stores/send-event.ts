import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface useSendActionState<T = any> {
    eKey: string|null;                              // 이벤트 키
    eVal: T|null;                                   // 이벤트 전달 값
    sendEvent: (eKey: string, eVal?: T) => void;    // 이벤트 전달 함수
    clean: () => void;                              // 이벤트 정리
};
 
//* 신규 이벤트 전달 생성 용
export const createSendAction = <T = any>() => {
    return create<useSendActionState<T>>()(
        subscribeWithSelector(set => ({
            eKey: null,
            eVal: null,
            sendEvent: (eKey, eVal) => set({eKey, eVal}),
            clean: () => set({eKey: null, eVal: null}),
        }))
    );
};

// //* 독립 state 생성
// export const {
//     Provider: SendActionProvider,
//     useStore: useSendAction,
// } = storeContext<useSendActionState>(createSendAction);


//--------------------------------------------------------
// 사용 샘플 코드 - 구독 방식
//--------------------------------------------------------
// import { useEffect, useState } from "react";
// 
// //* 컴포넌트 끼리 통신할 이벤트 state 생성 (eVal값 number)
// const useLocalAction = createSendAction<number>();
// 
// //* 앱 컴포넌트
// function App(){
//     const [ev, setEv] = useState('');       // 이벤트
//     const [value, setValue] = useState(0);  // 버튼 카운트
// 
//     useEffect(() => {
//         // 이벤트 구독
//         const unSub = useLocalAction.subscribe(
//             s => s.eKey,
//             (eKey: string) => {
//                 // 이벤트 키가 초기화 상태면 처리 안함
//                 if( eKey === null ){ return; }
// 
//                 const { eVal, clean } = useLocalAction.getState();
//
//                 setEv(eKey);         // 이벤트 키
//                 setValue(eVal);      // 카운트 버튼 컴포넌트에서 전달 한 버튼 카운트 값
//
//                 clean();             // 이벤트 값 초기화
//             }
//         );
//
//         // unMount 시 구독 취소
//         return unSub;
//     }, []);
//
//     return <>
//         {ev}-{value}
//         <CountButton label='A' />
//         <CountButton label='B' />
//         <CountButton label='C' />
//     </>;
// }
//
// //* 카운트 버튼
// function CountButton({label}: {
//     label: string;
// }){
//     const [cnt, setCnt] = useState(0);                      // 버튼 카운트
//     const sendEvent = useLocalAction(s => s.sendEvent);     // 구독 중인 곳에 전달 할 이벤트 함수
//
//     const onClick = () => {
//         const count = cnt+1;
//         setCnt(count);
//
//         sendEvent(label, count);    // 이벤트 전달
//     }
//
//     return <button onClick={onClick}>{label} {cnt}</button>;
// }