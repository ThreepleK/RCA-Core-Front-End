import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSendEvent } from "../../stores";
import { columnCustom, columnFilters, UI_DataGrid, type ColDef } from "@/compos/ui";
import { CommModal } from "@/compos/modal";
import { GridProcess } from "./grid-process";
import type { AgGridReact } from "ag-grid-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useGridListEvent } from "../../stores/send-grid";

export function Grid(){
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //* 그리드 준비 완료 처리
    const onReady = useCallback((e) => {
        // 이벤트 전달 함수 가져오기
        const { sendEvent } = useLocalSendEvent.getState();
        // 준비 완료
        sendEvent('ready', e.api);
    }, []);

    //* 그리드 리스트 가져오기
    useEffect(() => {
        //* 구독 이벤트
        const onSubscribe = (eKey: string) => {
            // 이벤트 키가 초기화 상태면 처리 안함
            if( eKey === null ){ return; }

            // 이벤트 관련 값, 함수 가져오기
            const { eVal, clean } = useGridListEvent.getState();

            // 이벤트 값 초기화
            clean();

            switch(eKey){
                // 그리드 리스트 값
                case 'list': setRowData(eVal as any); break;
                // 로딩 여부
                case 'loading': setIsLoading(eVal as boolean); break;
            }
        };

        //* 이벤트 구독 및 UnMount 시 구독 취소
        return useGridListEvent.subscribe(s => s.eKey, onSubscribe);
    }, []);

    return <>
        {/* 그리드 */}
        <UI_DataGrid
            columnDefs={_COLUMNS}
            rowData={rowData}
            ref={gridRef}
            onGridReady={onReady}
            loading={isLoading}
        />

        {/* 모달 창 */}
        <CommModal />

        {/* 그리드 처리 관련 */}
        <GridProcess />
    </>;
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    const {
        text, select, multiSelect,
        range, date, dateRange,
    } = columnFilters;

    const { actionBtns } = columnCustom;

    //* 컬럼에 사용될 필터
    const basicFilter = text();
    const activeFilter = multiSelect({
        data: [
            {label: 'Active', value: 'active'},
            {label: 'Inactive', value: 'inactive'},
        ]
    });
    const rangeFilter = range(100, 300);
    const dateFilter = dateRange();
    
    //* 액션 버튼 제어
    const actions = actionBtns({
        buttons: {
            edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
            delete: <IconTrash size={20} strokeWidth={1.5} title='Delete' />,
        },
        feedback: (btnKey: string, row: any) => {
            // 이벤트 전달 함수 가져오기
            const { sendEvent } = useLocalSendEvent.getState();

            // 버튼 제어 이벤트
            sendEvent(btnKey, row);
        }
    });

    //* 그리드 컬럼 설정
    return [
        { field: 'fullName',    headerName: 'Name', ...basicFilter },
        { field: 'email',       headerName: 'Email', },
        { field: 'team',        headerName: 'Team', },
        { field: 'org',         headerName: 'Organization', ...rangeFilter},
        { field: 'userGroup',   headerName: 'User group', },
        { field: 'status',      headerName: 'Status', ...activeFilter},
        { field: 'createdTime', headerName: 'Created time', ...dateFilter},
        { field: 'actions',     headerName: 'Actions', width: 120, ...actions},
    ];
})();