import { columnFilters, DataGrid, COLUMN_ITEM } from "@/compos/ui/data-grid";
import { Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useMemo, useState } from "react";

import style from "./content-area.module.css";
import { ConfirmModal, EditModal, useConfirmModalStore, useEditModalStore } from "@/compos/ui/modal";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MRT_TableOptions } from "mantine-react-table";

export function ContentArea() {
    const [selectedRow, setSelectedRow] = useState<(typeof _TMP_DATA)[0] | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //* 그리드 row 선택
    const handleRowClick = (row: any) => {
        setSelectedRow(row);
    };
  
    //* 그리드 추가 옵션
    const opts = useMemo(() => ({
        mantineTableBodyRowProps: ({ row, table, renderedRowIndex }) => ({
            onClick: () => handleRowClick(row.original),
            style: { cursor: "pointer" },
        }) as MRT_TableOptions<any>['mantineTableBodyRowProps'],
    }), []);
  
    // Action 컬럼을 추가
    const columns: COLUMN_ITEM[] = useMemo(() => [
        ..._COLUMNS,
    ], [_COLUMNS]);
  
    return (
        <div className={style["cont-area"]}>
            <DataGrid columns={columns} data={_TMP_DATA} opts={opts as any} />
        </div>
    );
}

//* 자동완성 필터
const _BASIC_FILTER = columnFilters.text({
});

const _DATE_RANGE_FILTER = columnFilters.dateRange({
    accessorKey: 'lastUpdatedBy',
    dateFormat: 'YYYY-MM-DD',
});

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = [
    { accessorKey: "name", header: "Name", ..._BASIC_FILTER },
    { accessorKey: "email", header: "Email" , ..._BASIC_FILTER},
];

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "admin",
        email: "test@gmail.com",
    },
    {
        id: "1345addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "yunny",
        email: "yunny@gmail.com",
    },
    {
        id: "1375addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "ella",
        email: "ella@gmail.com",
    },
    {
        id: "1393addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "haley",
        email: "haley@gmail.com",
    },
    {
        id: "1303addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "tk",
        email: "tk@gmail.com",
    },
];