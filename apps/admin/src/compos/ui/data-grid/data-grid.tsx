import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from "mantine-react-table";
import { gridIcons } from "./grid-icons";
import "mantine-react-table/styles.css";
import style from "./data-grid.module.css";
import { Anchor, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ConfirmModal, useConfirmModalStore } from "../modal";

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
  const onDelete = (row: any) => {
    // 확인 모달
    ApplyModal("delete", () => {
      // delete action
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
            onDelete(row);
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
    <>
      <ConfirmModal />
      <MantineReactTable table={table} />
    </>
  );
}

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
