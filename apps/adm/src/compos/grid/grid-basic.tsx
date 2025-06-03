import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import type { GridApi, GridReadyEvent } from "ag-grid-community";

import { createSendAction, type useSendActionState } from "@/stores/send-event";
import { UI_DataGrid, type ColDef } from "../ui";
import { CommModal } from "../modal";

//* 그리드 내 처리할 이벤트 전달 store
export type UseGridEvent = UseBoundStore<StoreApi<useSendActionState>>;

/**
 * Grid (기본 타입)
 * @param column 컬럼 정보
 * @param processCB 그리드 제어 용
 */
export function GridBasic({ columns, processCB }: {
    columns: ColDef[];
    processCB: ( 
        api: GridApi<any>,
        useGridEvent: UseGridEvent
    ) => void;
}){
    // row 데이터, 로딩
    const [rowData, setRowData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //* ProcessCB 사용 후 release 처리 용
    const pReleaseRef = useRef(null);

    //* 그리드와 수신용 이벤트
    const useGridEvent = useMemo(() => createSendAction<any>(), []);

    //* 그리드 준비 완료
    const onReady = useCallback((e: GridReadyEvent<any>) => {
        // 구독 해지를 위한 ref 등록
        pReleaseRef.current = processCB(e.api, useGridEvent);
    }, []);

    //* 그리드 관련 구독 처리
    useEffect(() => {
        //* 구독 이벤트
        const onSubscribe = (eKey: string) => {
            // 이벤트 키가 초기화 상태면 처리 안함
            if( eKey === null ){ return; }

            // 이벤트 관련 값, 함수 가져오기
            const { eVal, clean } = useGridEvent.getState();

            // 이벤트 값 초기화
            clean();

            switch(eKey){
                // 그리드 리스트 값
                case 'list': setRowData(eVal as any); break;
                // 로딩 여부
                case 'loading': setIsLoading(eVal as boolean); break;
            }
        };

        //* 이벤트 구독 처리
        const unSub = useGridEvent.subscribe(s => s.eKey, onSubscribe);

        //* UnMount 처리리
        return () => {
            // 구독 취소
            unSub();
            // processCB release 처리 (or 구독 취소)
            if( pReleaseRef.current ){
                pReleaseRef.current();
            }
        };
    }, []);


    return <>
        {/* 그리드 */}
        <UI_DataGrid
            columnDefs={columns}
            rowData={rowData}
            onGridReady={onReady}
            loading={isLoading}
        />

        {/* 모달 창 */}
        <CommModal />
    </>;
}