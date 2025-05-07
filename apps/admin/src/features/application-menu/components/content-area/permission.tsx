import { Flex, Text } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useMemo } from 'react';

export function Permission(){

    //* 데이터 없음 아이콘 설정
    const noDataIco = useMemo(() => {
        return <NoDataIcon dataLen={_TMP_DATA.length} />
    }, [_TMP_DATA.length]);

    return (
        <DataTable
            highlightOnHover
            columns={_COLUMNS as any}
            records={_TMP_DATA}
            // idAccessor='id'
            noRecordsIcon={noDataIco}
            noRecordsText=''
        />
    );
}

/**
 * 그리드 데이터 없음 표기
 */
function NoDataIcon({ dataLen }: {
    dataLen: number;
}){
    if( dataLen === 0 ){
        return <Flex justify='center' align='center' direction='column' gap='xs'>
            <IconDatabaseOff size={30} strokeWidth={1.5} />
            <Text size='md'>No Datas</Text>
        </Flex>;
    } else {
        return <></>;
    }
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