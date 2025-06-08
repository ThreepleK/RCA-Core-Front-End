import type { ColDef, GridApi } from "ag-grid-community";

import type { SectionStore } from "@/stores";
import { GridBasic, type GridDeleteParams } from "@/compos/grid";
import { api_tabsMemberList } from "@/features/user-group/apis";
import { editViewStore } from "@/features/user-group/stores";
import { addMemberProcess } from "./members-add";

/**
 * [User Group > Edit]
 * Tab > Members
 */
export function TabMembers(){
    return <>
        <GridBasic
            columns={_COLUMNS}
            processCB={gridProcess}
        />
    </>;
}

/**
 * 그리드 처리
 */
function gridProcess(
    gridApi: GridApi<any>,
    gridConn: SectionStore
){

    //* 리스트 불러오기
    const onListLoad = async () => {
        // 로딩 시작
        gridConn.trigger('loading', true);

        // 리스트 가져오기
        const res = await api_tabsMemberList();

        // 그리드에 리스트 전달 후 로딩 끝
        gridConn.triggers({
            'list': res,
            'loading': false
        });
    };

    //* init
    (async () => {
        editViewStore.on('tab-members', async (row) => {
            console.log('row', row);
            await onListLoad();
        });
        editViewStore.on('save-members', async () => {
            console.log('Members 저장');
        });
        editViewStore.on('add-members', async () => {
            console.log('Members 추가');
            addMemberProcess();
        });

        // Members 선택 삭제
        editViewStore.on('remove-members', async () => {
            // 그리드에서 선택된 row 가져오기
            const rows = gridApi.getSelectedRows();
            // 계정 삭제 모달
            gridConn.trigger('delete-modal', {
                title: 'Remove member',
                content: 'Do you want to remove the selected users?',
                rows,
                callback: onListLoad,
                apiFn: rows => {
                    // 삭제 임시처리
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve({
                                isErr: false,
                                msg: '',
                                res: null,
                            })
                        }, 1000);
                    });
                }
            } as GridDeleteParams);
        });
    })();

    // unMount
    return () => editViewStore.offs([
        'tab-members',
        'save-members',
        'add-members',
        'remove-members'
    ]);
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    
    //* 그리드 컬럼 설정
    return [
        { field: 'userName',    headerName: 'ID' },
        { field: 'fullName',    headerName: 'Full name' },
        { field: 'email',       headerName: 'Email', },
        { field: 'status',      headerName: 'Status',       width: 100},
    ];
})();