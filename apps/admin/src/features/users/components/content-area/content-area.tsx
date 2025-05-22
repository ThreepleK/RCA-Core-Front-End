import { DataGrid } from "@/compos/ui/data-grid";
import {
  Box,
  Button,
  Drawer,
  Input,
  Stack,
  Switch,
  Table,
  TextInput,
} from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useState } from "react";

import style from "./content-area.module.css";

export function ContentArea() {
  const [selectedRow, setSelectedRow] = useState<(typeof _TMP_DATA)[0] | null>(
    null
  );
  console.log("selectedRow", selectedRow);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (row: any) => {
    setSelectedRow(row.row.original);
    setIsDrawerOpen(true);
  };

  const opt = {
    mantineTableBodyRowProps: (row: any) => ({
      onClick: () => handleRowClick(row),
      style: { cursor: "pointer" },
    }),
  };

  return (
    <div className={style["cont-area"]}>
      <DataGrid columns={_COLUMNS} data={_TMP_DATA} opts={opt} />
      <Drawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Edit User"
        position="right"
        padding="md"
        size="md"
      >
        {selectedRow && (
          <Stack>
            <TextInput label="Name" defaultValue={selectedRow.name} />
            <TextInput label="Department" />
            <Button onClick={close}>저장</Button>
          </Stack>
        )}
      </Drawer>
    </div>
  );
}

type COLUMN_ITEM = MRT_ColumnDef<any>;

//* Y/N 필터
const _YN_FILTER = {
  filterVariant: "select",
  mantineFilterSelectProps: {
    data: ["Y", "N"],
  },
} as COLUMN_ITEM;

//* 컬럼 정보
const _COLUMNS: COLUMN_ITEM[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "createdDate", header: "Created Date" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "lastUpdatedDate", header: "Last Updated Date" },
  { accessorKey: "lastUpdatedBy", header: "Last Updated By" },
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
];
