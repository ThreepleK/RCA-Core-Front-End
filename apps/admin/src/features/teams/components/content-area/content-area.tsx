import { DataGrid } from '@/compos/ui/data-grid';
import { Button, Input, Switch, Table } from '@mantine/core';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useEffect, useState } from 'react';

import style from './content-area.module.css'

export function ContentArea({ className }: {
    className: string,
}){

    return <div className={className}>
        <DataGrid columns={_COLUMNS} data={_TMP_DATA} />
    </div> ;
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
      { accessorKey: 'name',         header: 'Name' },
      { accessorKey: 'createdDate',     header: 'Created Date', ..._YN_FILTER },
      { accessorKey: 'createdBy',       header: 'Created By', ..._YN_FILTER },
      { accessorKey: 'lastUpdatedDate',     header: 'Last Updated Date', ..._YN_FILTER },
      { accessorKey: 'lastUpdatedBy',     header: 'Last Updated By', ..._YN_FILTER },
  ];
  
  // 그리드 임시 데이터
  const _TMP_DATA = [
      {
          id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
          name: "admin",
          createdDate: "2025-05-20",
          createdBy: "admin",
          lastUpdatedDate: "2025-05-20",
          lastUpdatedBy: "admin",
      },
  ]