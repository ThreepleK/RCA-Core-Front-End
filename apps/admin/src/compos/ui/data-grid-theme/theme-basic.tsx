import { MRT_ColumnDef, MRT_Row, MRT_TableInstance, MRT_TableOptions } from "mantine-react-table";
import { DataGrid } from "../data-grid/data-grid";
import { CommModal } from "../modal/comm-modal";
import { ReactNode, useMemo } from "react";
import { COLUMN_ITEM, columnFilters } from "../data-grid/data-grid-filters";
import { ConfirmModal } from "../modal";

/**
 * 그리드 기본
 * @param columns 컬럼 정보
 * @param data 그리드 내 보여줄 데이터
 * @param opts 그리드 기본 설정
 * @param actions 액션 버튼 옵션
 * @param actions.buttons 액션 버튼
 * @param actions.feedback 액션 버튼 피드백 콜백백
 * @param rowClick 그리드 row 클릭 이벤트
 * @param onReady 그리드 준비 완료 이벤트
 */
export function GridThemeBasic<T>({ columns, data, opts, actions, rowClick, onReady }: {
    columns: MRT_ColumnDef<T>[];
    data: any;
    opts?: MRT_TableOptions<T>;
    actions?: {
        buttons: {[key: string]: string|ReactNode},
        feedback: (btnKey: string, row: MRT_Row<T>) => void,
    }
    rowClick?: (row: MRT_Row<T>) => void;
    onReady?: (table: MRT_TableInstance<any>)=>void;
}){
    //* 컬럼 재설정
    const reColumns = useMemo(() => {
        if( !actions ){ return columns; }

        return [
            ...columns,
            columnFilters.actionBtns(actions)
        ];
    }, [columns]) as COLUMN_ITEM[];

    //* 옵션 재설정
    const reOpts = useMemo(() => {
        let res: any = {};

        //* 설정된 옵션 값이 있을 경우
        if( typeof opts !== 'undefined' ){
            res = {...opts};
        }

        //* 셀 row 클릭 이벤트 등록 (해당 속성을 추가하지 않았을 경우)
        if( rowClick && !('mantineTableBodyRowProps' in res) ){
            res['mantineTableBodyRowProps'] = ({ row }) => {                
                return {
                    onClick: () => rowClick(row.original),
                    style: { cursor: "pointer" },
                } as MRT_TableOptions<any>['mantineTableBodyRowProps']
            };
        }

        return res;
    }, [opts]);

    return <>
        {/* 그리드 */}
        <DataGrid
            columns={reColumns}
            data={data}
            opts={reOpts as any}
            onReady={onReady}
        />

        {/* 모달 */}
        <ConfirmModal />
        <CommModal />
    </>;
}