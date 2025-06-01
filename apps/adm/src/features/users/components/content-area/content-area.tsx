import { columnFilters, UI_DataGrid, type ColDef } from '@/compos/ui';

export function ContentArea(){
    return <UI_DataGrid
        columnDefs={_COLUMNS}
        rowData={_TMP_DATA}
    />;
}

const _COLUMNS: ColDef[] = (() => {
    const {text, select} = columnFilters;

    // 기본 필터
    const basicFilter = text({});
    const ActiveFilter = select({
        data: [
            {label: 'Active', value: 'active'},
            {label: 'Deactive', value: 'deactive'},
        ]
    });

    return [
        { field: 'fullName',    headerName: 'Name', ...basicFilter },
        { field: 'email',       headerName: 'Email', },
        { field: 'team',        headerName: 'Team', },
        { field: 'org',         headerName: 'Organization', },
        { field: 'userGroup',   headerName: 'User group', },
        { field: 'status',      headerName: 'Status', ...ActiveFilter},
        { field: 'createdTime', headerName: 'Created time', },
    ];
})();

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        fullName: "admin",
        email: 'admin@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'active',
        createTime: '2025-05-23 15:47:00',
    },
    {
        id: "1323addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "yunny",
        email: 'yunny@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'deactive',
        createTime: '2025-05-23 15:49:00',
    },
    {
        id: "2343addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "tk",
        email: 'tk@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'active',
        createTime: '2025-05-23 16:24:00',
    },
];