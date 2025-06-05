import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import type { GridApi, GridReadyEvent } from "ag-grid-community";

import { createSendAction, type useSendActionState } from "@/stores/send-event";
import { UI_DataGrid, type ColDef } from "@/compos/ui";
import { CommModal } from "@/compos/modal";

import style from './grid-basic.module.css'
import { GridTop } from "./grid-top";

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
        gridSendEvent: (key: string, val?: any) => void,
        gridRecevieEvent: any
    ) => void;
}){
    const apiRef = useRef<GridApi>(null);
    const topRef = useRef<(key: string, val?: any)=>void>(null);

    // row 데이터, 로딩, 페이지
    const [rowData, setRowData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //* ProcessCB 사용 후 release 처리 용
    const pReleaseRef = useRef(null);

    //* ProcessCB → Grid 단일 방향 수신용 이벤트
    const resEvent = useMemo(() => createSendAction<any>(), []);
    //* Grid → ProcessCB 단일 방향 송신용 이벤트
    const reqEvent = useMemo(() => createSendAction<any>(), []);

    //* 그리드 준비 완료
    const onReady = useCallback((e: GridReadyEvent<any>) => {
        // 구독 해지를 위한 ref 등록
        pReleaseRef.current = processCB(
            e.api,
            resEvent.getState().sendEvent,
            reqEvent,
        );

        apiRef.current = e.api;
    }, []);

    //* 그리드 관련 구독 처리
    useEffect(() => {
        //* 구독 이벤트
        const onSubscribe = (eKey: string) => {
            // 이벤트 키가 초기화 상태면 처리 안함
            if( eKey === null ){ return; }

            // 이벤트 관련 값, 함수 가져오기
            const { eVal, clean } = resEvent.getState();

            // 이벤트 값 초기화
            clean();

            switch(eKey){
                // 그리드 리스트 값
                case 'list':
                    // 그리드 리스트 설정
                    setRowData(eVal as any);
                    // Top에 리스트 이벤트 전달
                    topRef.current('onLoad', (eVal as any[]).length);
                break;
                // 로딩 여부
                case 'loading': setIsLoading(eVal as boolean); break;
            }
        };

        //* 이벤트 구독 처리
        const unSub = resEvent.subscribe(s => s.eKey, onSubscribe);

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

    //* 그리드 관련 이벤트
    const onEvent = useCallback((key: string, val?: any) => {
        topRef.current(key);
    }, []);

    //* 상단 컴포넌트 연결 커넥터
    const connector = useCallback((
        topConn: (key: string, val?: any) => void
    ) => {
        topRef.current = topConn;
    }, []);

    return <>
        {/* 상단 */}
        <GridTop
            getGridApi={() => apiRef.current}
            connector={connector}
        />

        {/* 그리드 */}
        <div className={style['grid-body']}>
            <UI_DataGrid
                columnDefs={columns}
                rowData={rowData}
                onGridReady={onReady}
                loading={isLoading}
                onFilterChanged={() => { onEvent('onFilterChange'); }}
                onSortChanged={() => { onEvent('onSortChange'); }}
                onRowSelected={() => { onEvent('onRowSelected'); }}
                pagination={true}
            />
        </div>

        {/* 모달 창 */}
        <CommModal />
    </>;
}