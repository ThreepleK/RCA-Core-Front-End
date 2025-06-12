import { useLocalSendEvent } from "../../stores";
import { columnCustom, columnFilters, UI_DataGrid, type ColDef } from "@/compos/ui";
import { gridProcess } from "./grid-process";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { GridBasic } from "@/compos/grid";
import dayjs from "dayjs";

/**
 * 그리드
 */
export function Grid(){
    return <GridBasic
        columns={_COLUMNS}
        processCB={gridProcess}
    />;
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    const {
        text, select, multiSelect,
        range, date, dateRange,
    } = columnFilters;

    const { actionBtns } = columnCustom;

    //* 컬럼에 사용될 필터
    const rangeFilter = range(0, 200);
    
    //* 액션 버튼 제어
    const actions = actionBtns({
        buttons: {
            edit: <IconEdit size={20} strokeWidth={1.5} title='Edit' />,
            delete: <IconTrash size={20} strokeWidth={1.5} title='Delete' />,
        },
        feedback: (btnKey: string, row: any) => {
            // 이벤트 전달 함수 가져오기
            const { sendEvent } = useLocalSendEvent.getState();

            // 버튼 제어 이벤트
            sendEvent(btnKey, row);
        }
    });

    //* 그리드 컬럼 설정
    return [
        { field: 'name',            headerName: 'Group name' },
        { field: 'predefined',      headerName: 'Pre-defined', width: 130,
            valueGetter: ({ data: {predefined} }) => {
                return (predefined ? 'Y' : 'N');
            }
        },
        { field: 'description',     headerName: 'Description', width: 400, },
        { field: 'users',           headerName: 'Users',  ...rangeFilter,
            valueGetter: ({ data: {users} }) => {
                return Array.isArray(users) ? users.length : 0;
            },
        },
        { field: 'status',          headerName: 'Status', width: 120, },
        { field: 'permissionSets',  headerName: 'Permission sets', width: 300,
            valueGetter: ({ data: {permissionSets} }) => {
                return (permissionSets && permissionSets.length > 0
                    ? permissionSets.map(r => r.name).join(', ')
                    : '-'
                );
            }
        },
        { field: 'actions',         headerName: 'Actions', width: 120, ...actions},
    ];
})();