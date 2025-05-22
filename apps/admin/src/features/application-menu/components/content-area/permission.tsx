import { DataGrid, COLUMN_ITEM, columnFilters } from '@/compos/ui/data-grid';
import { useTreeStore } from '@/compos/ui/tree-editor';

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

//* 자동완성 필터
const _BASIC_FILTER = columnFilters.text({
});

//* 자동완성 필터
const _AUTO_FILTER = columnFilters.auto({
    data: ['chatGPT', '집에 가고 싶어요', '오늘은 빨리 끝낼 수 있을까?']
});

//* Y/N 필터
const _YN_FILTER = columnFilters.multiSelect({
    data: ['Y', 'N']
});
// const _YN_FILTER = columnFilters.select({
//     data: ['Y', 'N']
// });

//* 범위 필터
const _CNT_FILTER = columnFilters.rangeSlider({
    min: 0, max: 100, step: 2
});

//* 체크박스 필터
const _CHK_FILTER = columnFilters.chkbox({
    label: 'Y/N',
    matchValue: {
        true: 'Y',
        false: 'N',
        etc: '-',
    }
});

//* 달력 필터
// const _DATE_FILTER = columnFilters.date({
//     accessorKey: 'regDate',
//     dateFormat: 'YYYY-MM-DD',
// });
const _DATE_RANGE_FILTER = columnFilters.dateRange({
    accessorKey: 'regDate',
    dateFormat: 'YYYY-MM-DD',
});

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = [
    { accessorKey: 'role',         header: '역할', ..._AUTO_FILTER },
    { accessorKey: 'isCreate',     header: '생성 권한', ..._CHK_FILTER },
    { accessorKey: 'isRead',       header: '조회 권한', ..._YN_FILTER },
    { accessorKey: 'isModify',     header: '수정 권한', ..._YN_FILTER },
    { accessorKey: 'isRemove',     header: '삭제 권한', ..._YN_FILTER },
    { accessorKey: 'regDate',      header: '생성일', ..._DATE_RANGE_FILTER },
    { accessorKey: 'creator',      header: '생성자', ..._BASIC_FILTER },
    { accessorKey: 'count',        header: '카운트', ..._CNT_FILTER },
];

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        role: "admin",
        isCreate: true,
        isRead: "Y",
        isModify: "Y",
        isRemove: "Y",
        regDate: "2025.05.07",
        creator: "admin",
        count: 10,
    },
]