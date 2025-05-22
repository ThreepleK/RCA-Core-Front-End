import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from "mantine-react-table";
import { ModalsProvider } from "@mantine/modals";
import { gridIcons } from "./grid-icons";
import "mantine-react-table/styles.css";
import style from "./data-grid.module.css";
import { ActionIcon, Anchor, Flex, Group, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";

export function DataGrid<T>({
  columns,
  data,
  opts,
}: {
  columns: MRT_ColumnDef<T>[];
  data: any;
  // opts?: MRT_TableOptions<T>;
  opts?: any;
}) {
  //DELETE action
  const openDeleteConfirmModal = (row: any) => {
    modals.openConfirmModal({
      title: "Are you sure you want to delete ?",
      children: (
        <Text>
          Are you sure you want to delete ? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      // onConfirm: () => deleteUser(row.original.id),
    });
  };

  // Action 컬럼을 추가
  const column: MRT_ColumnDef<T>[] = [
    ...columns,
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
            openDeleteConfirmModal(row);
          }}
        >
          Remove
        </Anchor>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns: column,
    data,
    enableRowNumbers: true, // 컬럼에 숫자 표기
    rowNumberDisplayMode: "static",

    enableColumnResizing: false, // 컬럼 리사이징

    enableRowSelection: false, // 행 선택
    // enableEditing: true, // 행 편집
    // enableColumnActions: false, // 컬럼 액션 (정렬, 필터링)
    enableTopToolbar: true, // 상단 툴바 (필터)
    enableBottomToolbar: true, // 하단 툴바 (페이지네이션)
    enableFullScreenToggle: true, // 풀스크린 토글 버튼
    enableDensityToggle: true, // 셀 세로 높이 토클 버튼
    initialState: {
      density: "xs", // 셀 세로 높이 기본 값
    },

    icons: gridIcons, // 재설정 할 아이콘

    //* 상단 툴바 설정
    mantineTopToolbarProps: (props) => ({
      className: style["grid-top-toolbar"],
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <div className={style["grid-top-toolbar"]}>
        <Group pr="md">
          <Text size="ml">Total : {data.length}</Text>
        </Group>
      </div>
    ),

    ...opts, // 별도 설정 값
  } as MRT_TableOptions<any>);

  return (
    <ModalsProvider>
      <MantineReactTable table={table} />
    </ModalsProvider>
  );
}
