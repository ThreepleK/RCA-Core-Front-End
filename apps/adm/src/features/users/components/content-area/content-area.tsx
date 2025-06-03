import { columnFilters, UI_DataGrid, type ColDef } from '@/compos/ui';
import { columnCustom } from '@/compos/ui/ui-data-grid/data-grid-cols';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { GridProcess } from './grid-process';
import { useLocalSendEvent } from '../../stores';
import { useCallback, useRef } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import { CommModal } from '@/compos/modal/comm-modal';

/**
 * 본문 컨텐츠
 */
export function ContentArea(){
    const gridRef = useRef<AgGridReact>(null);
    const onReady = useCallback((e) => {
        // 이벤트 전달 함수 가져오기
        const { sendEvent } = useLocalSendEvent.getState();

        // 준비 완료
        sendEvent('ready', e.api);
    }, []);

    return <>
        {/* 그리드 */}
        <UI_DataGrid
            columnDefs={_COLUMNS}
            rowData={_TMP_DATA as any}
            rowSelection={{mode: 'multiRow'}}
            ref={gridRef}
            onGridReady={onReady}
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
            {label: 'Deactive', value: 'deactive'},
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

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        fullName: "admin",
        email: 'admin@bistelligence.ai',
        team: 'bistelligence',
        org: 100,
        userGroup: '',
        status: 'active',
        createdTime: '2025-05-23 15:47:00',
    },
    {
        id: "1323addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "yunny",
        email: 'yunny@bistelligence.ai',
        team: 'bistelligence',
        org: 200,
        userGroup: '',
        status: 'deactive',
        createdTime: '2025-06-10 15:49:00',
    },
    {
        id: "2343addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "tk",
        email: 'tk@bistelligence.ai',
        team: 'bistelligence',
        org: 300,
        userGroup: '',
        status: 'active',
        createdTime: '2025-06-23 16:24:00',
    },
];