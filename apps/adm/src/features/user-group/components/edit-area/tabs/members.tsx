import type { ColDef, GridApi } from "ag-grid-community";

import { GridBasic } from "@/compos/grid";
import { api_tabsMemberList } from "@/features/user-group/apis";
import { editViewStore } from "@/features/user-group/stores";
import type { SectionStore } from "@/stores";

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
        });
        editViewStore.on('remove-members', async () => {
            console.log('Members 선택 삭제');
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