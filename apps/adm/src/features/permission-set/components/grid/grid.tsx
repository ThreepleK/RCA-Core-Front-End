import { useLocalSendEvent } from "../../stores";
import { columnCustom, columnFilters, type ColDef } from "@/compos/ui";
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
        { field: 'name',            headerName: 'Permission set' },
        { field: 'predefined',      headerName: 'Predefined',
            valueGetter: ({ data: {predefined} }) => {
                return predefined ? 'Y' : 'N';
            }
        },
        { field: 'assignedApps',    headerName: 'Assigned Apps',
            valueGetter: ({ data: {menus} }) => {
                return menus.map(r => r.displayName).join(', ');
            }
        },
        { field: 'userGroups',      headerName: 'User groups',
            valueGetter: ({ data: {userGroups} }) => {
                return userGroups.map(r => r.name).join(', ');
            }
        },
        { field: 'users',           headerName: 'Users',
            valueGetter: ({ data: {users} }) => {
                return users.map(r => r.username).join(', ');
            }
        },
        { field: 'description',     headerName: 'Description' },
        { field: 'actions',         headerName: 'Actions', width: 120, ...actions},
    ];
})();