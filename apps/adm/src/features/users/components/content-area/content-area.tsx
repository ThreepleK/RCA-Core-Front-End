import { columnFilters, UI_DataGrid, type ColDef } from '@/compos/ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function ContentArea(){
    return <UI_DataGrid
        columnDefs={_COLUMNS}
        rowData={_TMP_DATA}
    />;
}

const _COLUMNS: ColDef[] = (() => {
    const {
        text, select, multiSelect,
        range, date, dateRange,
        actionBtns
    } = columnFilters;

    // 기본 필터
    const basicFilter = text();
    const activeFilter = multiSelect({
        data: [
            {label: 'Active', value: 'active'},
            {label: 'Deactive', value: 'deactive'},
        ]
    });
    const rangeFilter = range(100, 300);
    const dateFilter = dateRange();
    
    const actions = actionBtns({
        buttons: {
            edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
            delete: <IconTrash size={20} strokeWidth={1.5} title='Delete' />,
        },
        feedback: (btnKey: string) => {
            console.log('btnKey', btnKey);
        }
    });

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