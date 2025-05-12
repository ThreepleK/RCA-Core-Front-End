import { useMemo } from 'react';
import { DataTable } from 'mantine-datatable';
import { NoDataIcon } from './no-data-icon';

export function DataGrid({ columns, data }: {
    columns: any;
    data: any;
}){

    //* 데이터 없음 아이콘 설정
    const noDataIco = useMemo(() => {
        return <NoDataIcon dataLen={data.length} />
    }, [data.length]);

    return (
        <DataTable
            highlightOnHover
            columns={columns as any}
            records={data}
            // idAccessor='id'
            noRecordsIcon={noDataIco}
            noRecordsText=''
        />
    );
}