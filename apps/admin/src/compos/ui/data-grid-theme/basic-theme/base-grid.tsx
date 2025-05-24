import { useMemo } from "react";
import { useStore } from "zustand";
import { MRT_TableInstance, MRT_TableOptions } from "mantine-react-table";
import { DataGrid } from "../../data-grid/data-grid";
import { CommModal } from "../../modal/comm-modal";
import { COLUMN_ITEM, columnFilters } from "../../data-grid/data-grid-filters";
import { ConfirmModal } from "../../modal";
import { useGridEventStore, useGridStore } from "./";

/**
 * 기본 그리드
 */
export function BaseGrid(){
    const gridStore = useGridStore();
    const eventStore = useGridEventStore();

    const { columns, gridOpts, gridData, actionsCols, isLoading } = useStore(gridStore, s => s);
    const { sendEvent } = useStore(eventStore, s => s);

    //* 컬럼 재설정
    const reColumns = useMemo(() => {
        // 액션 컬럼이 없으면 기본 컬럼 전달
        if( !actionsCols ){ return columns; }

        // 액션 컬럼 버튼 추가
        return [
            ...columns,
            columnFilters.actionBtns({
                buttons: actionsCols,
                feedback: (key, row) => {
                    sendEvent(key, row.original);
                }
            })
        ];
    }, [columns]) as COLUMN_ITEM[];

    //* 옵션 재설정
    const reOpts = useMemo(() => {
        let res: any = {
            enableRowSelection: true,       // 좌측 선택
            state: {
                isLoading,                  // 로딩 여부
            },
        };

        //* 설정된 옵션 값이 있을 경우
        if( gridOpts ){
            res = {
                ...res,
                ...gridOpts
            };
        }

        //* 셀 row 클릭 이벤트 (해당 속성을 추가하지 않았을 경우)
        if( !('mantineTableBodyRowProps' in res) ){
            res['mantineTableBodyRowProps'] = ({ row }) => {                
                return {
                    onClick: () => sendEvent('row-click', row.original),
                    style: { cursor: "pointer" },
                } as MRT_TableOptions<any>['mantineTableBodyRowProps']
            };
        }

        return res;
    }, [gridOpts, isLoading]);

    //* 그리드 준비
    const onReady = (table: MRT_TableInstance<any>) => {
        sendEvent('ready', table);
    }

    return <>
        {/* 그리드 */}
        <DataGrid
            columns={reColumns}
            data={gridData}
            opts={reOpts as any}
            onReady={onReady}
        />

        {/* 모달 */}
        <ConfirmModal />
        <CommModal />
    </>;
}