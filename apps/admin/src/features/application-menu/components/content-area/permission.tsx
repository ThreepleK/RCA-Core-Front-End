import { DataGrid } from '@/compos/ui/data-grid';
import { useTreeStore } from '@/compos/ui/tree-editor';

export function Permission(){
    const { selectedItem } = useTreeStore(s => s);

    //* 선택된 메뉴가 없을 때
    if( selectedItem === null ){
        return <>Please select the menu on the left.</>;
    }

    return (
        <DataGrid
            columns={_COLUMNS as any}
            data={_TMP_DATA}
        />
    );
}

// 컬럼 정보
const _COLUMNS = [
    { accessor: 'no',           title: 'No', textAlign: 'right',
        render: (record: any) => {
            return _TMP_DATA.indexOf(record) + 1;
        }
    },
    { accessor: 'role',         title: '역할' },
    { accessor: 'isCreate',     title: '생성 권한' },
    { accessor: 'isRead',       title: '조회 권한' },
    { accessor: 'isModify',     title: '수정 권한' },
    { accessor: 'isRemove',     title: '삭제 권한' },
    { accessor: 'regDate',      title: '생성일' },
    { accessor: 'creator',      title: '생성자' },
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