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
        onEdit(row);
    };
    
    //* Edit action
    const onEdit = (row: any) => {
        EditDetailModal(row, () => {});
    };

    //* DELETE action
    const onDelete = (row: any) => {
        // 확인 모달
        ApplyModal("delete", () => {
            // delete action
        });
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
        columnFilters.actionBtns({
            // 버튼
            buttons: {
                // edit: <Anchor component="button" type="button" c="blue" size='sm'>Edit</Anchor>,
                // rm: <Anchor component="button" type="button" c="red" size='sm'>Remove</Anchor>,
                edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
                rm: <IconTrash size={20} strokeWidth={1.5} title='Remove' />,
            },
            // 버튼 클릭 처리
            feedback: (btnKey, row) => {
                switch( btnKey ){
                    case 'edit': handleRowClick(row.original); break;
                    case 'rm': onDelete(row.original); break;
                }
            }
        })
    ], [_COLUMNS]);
  
    return (
        <div className={style["cont-area"]}>
            <ConfirmModal />
            <EditModal />
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
            <Text size="md" fw={500} c="blue">Delete</Text>,
            <Text size="sm">
                Are you sure you want to delete ? This action cannot be undone.
            </Text>,
            "Delete", callback
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
        <Text size="md" fw={500} c="blue">Edit Team Details</Text>,
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
        "Save", callback
    );
    setOpen(true);
  }