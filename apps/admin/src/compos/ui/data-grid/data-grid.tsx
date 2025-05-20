import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from 'mantine-react-table';
import { gridIcons } from './grid-icons'
import 'mantine-react-table/styles.css';
import style from './data-grid.module.css';
import { Box, Button, Drawer, Group, TextInput, Text } from '@mantine/core';
import { useState } from 'react';

export function DataGrid<T>({ columns, data, opts }: {
    columns: MRT_ColumnDef<T>[];
    data: any;
    opts?: MRT_TableOptions<T>;
}){
    const [selectedRow, setSelectedRow] = useState<null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleRowClick = (row: any) => {
        setSelectedRow(row);
        setIsDrawerOpen(true);
    };

    const table = useMantineReactTable({
        columns, data,
        enableRowNumbers: true,                 // 컬럼에 숫자 표기
        rowNumberDisplayMode: 'static',

        enableColumnResizing: false,            // 컬럼 리사이징

        enableRowSelection: false,               // 행 선택

        enableTopToolbar: true,                 // 상단 툴바 (필터)
        enableBottomToolbar: true,              // 하단 툴바 (페이지네이션)
        enableFullScreenToggle: true,           // 풀스크린 토글 버튼
        enableDensityToggle: true,             // 셀 세로 높이 토클 버튼
        initialState: {
            density: 'xs'                       // 셀 세로 높이 기본 값
        },

        icons: gridIcons,                       // 재설정 할 아이콘

        mantineTableBodyRowProps: (row) => ({
            onClick: () => handleRowClick(row),
            style: { cursor: 'pointer' },
        }),

        //* 상단 툴바 설정
        mantineTopToolbarProps: (props) => ({
            className: style['grid-top-toolbar']
        }),

        renderTopToolbarCustomActions: ({ table }) => (
            <div className={style['grid-top-toolbar']}>
                <Group pr="md">
                  <Text size="ml">
                    Total : {data.length}
                  </Text>
                </Group>
            </div>
        ),

        ...opts                                 // 별도 설정 값
    } as MRT_TableOptions<any>);

    return <>
    <MantineReactTable table={table} />
    <Drawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Edit Row"
        position="right"
        padding="md"
        size="md"
      >
        {selectedRow && (
          <Box>
            <TextInput
              label="이름"
            //   defaultValue={selectedRow.name}
              mb="sm"
            />
            <TextInput
              label="이메일"
            //   defaultValue={selectedRow.email}
              mb="sm"
            />
            <Button fullWidth>저장</Button>
          </Box>
        )}
      </Drawer>
      </>;
}