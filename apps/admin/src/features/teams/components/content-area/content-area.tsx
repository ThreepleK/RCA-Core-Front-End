import { columnFilters, DataGrid } from "@/compos/ui/data-grid";
import {
  Box,
  Button,
  Drawer,
  Text,
  Stack,
  Switch,
  Table,
  TextInput,
  Anchor,
  Textarea,
  Group,
} from "@mantine/core";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useEffect, useState } from "react";

import style from "./content-area.module.css";
import { ConfirmModal, EditModal, useConfirmModalStore, useEditModalStore } from "@/compos/ui/modal";

export function ContentArea() {
  const [selectedRow, setSelectedRow] = useState<{ name: string, members: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (row: any) => {
    console.log('row', row)
    setSelectedRow(row.row.original);
    EditDetailModal(selectedRow, () => {
    });
  };

  const opt = {
    mantineTableBodyRowProps: (row: any) => ({
      onClick: () => handleRowClick(row),
      style: { cursor: "pointer" },
    }),
  };

  //DELETE action
  const onDelete = (row: any) => {
    // 확인 모달
    ApplyModal("delete", () => {
      // delete action
    });
  };

  // Action 컬럼을 추가
  const columns: any = [
    ..._COLUMNS,
    {
      id: "actions", // ✅ 반드시 id 명시
      header: "Actions", // 헤더 비워도 됨
      enableColumnOrdering: false,
      enableSorting: false,
      enableEditing: false,
      Cell: ({ row }) => (
        <Anchor
          component="button"
          type="button"
          color="blue"
          onClick={(e) => {
            e.stopPropagation(); // row 클릭 방지
            onDelete(row);
          }}
        >
          Remove
        </Anchor>
      ),
    },
  ];

  return (
    <div className={style["cont-area"]}>
      <ConfirmModal />
      <EditModal />
      <DataGrid columns={columns} data={_TMP_DATA} opts={opt} />
    </div>
  );
}

type COLUMN_ITEM = MRT_ColumnDef<any>;

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
  { accessorKey: "members", header: "Members" , ..._BASIC_FILTER},
//   { accessorKey: "lastUpdatedDate", header: "Last Updated Date" },
  { accessorKey: "lastUpdatedBy", header: "Last updated by", ..._BASIC_FILTER},
];

// 그리드 임시 데이터
const _TMP_DATA = [
  {
    id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
    name: "admin",
    members: 'yunny',
    lastUpdatedBy: "admin",
  },
];

/**
 * [모달] 확인
 */
function ApplyModal(
    label: string, // 관련 라벨
    callback: () => void // 확인 콜백
  ) {
    //* 모달
    const { setOpen, setContent } = useConfirmModalStore.getState();
  
    // 취소 모달
    setContent(
      <Text size="md" fw={500} c="blue">
        Delete
      </Text>,
      <Text size="sm">
        Are you sure you want to delete ? This action cannot be undone.
      </Text>,
      "Delete",
      callback
    );
    setOpen(true);
  }

  /**
 * [모달] 수정
 */
function EditDetailModal(
    row: any, // 관련 라벨
    callback: () => void // 확인 콜백
  ) {
    //* 모달
    const { setOpen, setContent, setValue } = useEditModalStore.getState();
  
    // 취소 모달
    setContent(
      <Text size="md" fw={500} c="blue">
        Edit Team Details
      </Text>,
      <Stack>
        <TextInput
          label="Team Name"
          defaultValue={row?.name}
          required
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <Textarea
          label="Description"
          placeholder="Input placeholder"
        />
        <Group justify="space-between" mt="md">
          {/* <Button type="submit">Save</Button> */}
        </Group>
      </Stack>,
      "Save",
      callback
    );
    setOpen(true);
  }