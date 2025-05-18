import { DataGrid } from '@/compos/ui/data-grid';
import { useTreeStore } from '@/compos/ui/tree-editor';
import { MRT_ColumnDef } from 'mantine-react-table';

export function Permission(){
    const { selectedItem } = useTreeStore(s => s);

    //* 선택된 메뉴가 없을 때
    if( selectedItem === null ){
        return <>Please select the menu on the left.</>;
    }

    return (
        <DataGrid
            columns={_COLUMNS}
            data={_TMP_DATA}
        />
    );
}

type COLUMN_ITEM = MRT_ColumnDef<any>;

//* Y/N 필터
const _YN_FILTER = {
    filterVariant: 'select',
    mantineFilterSelectProps: {
        data: ['Y', 'N']
    }
} as COLUMN_ITEM;

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = [
    { accessorKey: 'role',         header: '역할' },
    { accessorKey: 'isCreate',     header: '생성 권한', ..._YN_FILTER },
    { accessorKey: 'isRead',       header: '조회 권한', ..._YN_FILTER },
    { accessorKey: 'isModify',     header: '수정 권한', ..._YN_FILTER },
    { accessorKey: 'isRemove',     header: '삭제 권한', ..._YN_FILTER },
    { accessorKey: 'regDate',      header: '생성일' },
    { accessorKey: 'creator',      header: '생성자' },
];

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        role: "admin",
        isCreate: "Y",
        isRead: "Y",
        isModify: "Y",
        isRemove: "Y",
        regDate: "2025-05-07",
        creator: "admin",
    },
]