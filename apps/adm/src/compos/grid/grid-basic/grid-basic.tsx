import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import type { GridApi, GridReadyEvent } from "ag-grid-community";

import { type useSendActionState } from "@/stores/send-event";
import { UI_DataGrid, type ColDef } from "@/compos/ui";
import { CommModal } from "@/compos/modal";

import style from './grid-basic.module.css'
import { GridTop } from "./grid-top";
import { SectionStore } from "@/stores";

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
        conn: SectionStore
    ) => void;
}){
    const apiRef = useRef<GridApi>(null);

    // row 데이터, 로딩, 페이지
    const [rowData, setRowData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //* ProcessCB 사용 후 release 처리 용
    const pReleaseRef = useRef(null);

    //* ProcessCB ↔ Grid 양방향 송/수신 용 이벤트
    let conn = useMemo(() => new SectionStore(), []);

    //* 그리드 준비 완료
    const onReady = useCallback((e: GridReadyEvent<any>) => {
        // 구독 해지를 위한 ref 등록
        pReleaseRef.current = processCB(
            e.api,
            conn,
        );

        apiRef.current = e.api;
    }, []);

    //* 그리드 관련 구독 처리
    useEffect(() => {

        //* 로딩 처리 (true: 로딩, false: 로딩 끝)
        conn.on('loading', (is: boolean) => setIsLoading(is));
        //* 리스트 설정
        conn.on('list', (data: any) => {
            const list = !data ? [] : data;

            // 그리드 리스트 설정
            setRowData(list);

            // Top에 리스트 이벤트 전달
            conn.trigger('top-onLoad', list.length);
        });

        //* UnMount 처리
        return () => {
            // processCB release 처리 (or 구독 취소)
            if( pReleaseRef.current ){
                pReleaseRef.current();
            }

            // 사용 된 store 제거
            conn.destroy();
            conn = null;
        };
    }, []);

    //* 그리드 관련 이벤트
    const onEvent = useCallback((key: string, val?: any) => {
        conn.trigger(key);
    }, []);

    console.log('loading', isLoading);

    return <>
        {/* 상단 */}
        <GridTop
            getGridApi={() => apiRef.current}
            conn={conn}
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