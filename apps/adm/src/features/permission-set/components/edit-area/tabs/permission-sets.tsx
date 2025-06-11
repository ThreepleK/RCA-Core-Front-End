import type { ColDef, GridApi } from "ag-grid-community";

import { editViewStore } from "@/features/user-group/stores";
import { GridBasic } from "@/compos/grid";
import type { SectionStore } from "@/stores";
import { api_tabsPermissionList } from "@/features/user-group/apis";

/**
 * [User Group > Edit]
 * Tab > Permission sets
 */
export function TabPermissionSets(){
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
        const res = await api_tabsPermissionList();

        // 그리드에 리스트 전달 후 로딩 끝
        gridConn.triggers({
            'list': res,
            'loading': false
        });
    };

    //* init
    (async () => {
        editViewStore.on('tab-permission', async (row) => {
            console.log('row', row);
            await onListLoad();
        });
        editViewStore.on('save-permission', async () => {
            console.log('Permission 저장');
        });
    })();

    // unMount
    return () => editViewStore.offs([
        'tab-permission',
        'save-permission',
    ]);
}

// 그리드 컬럼 설정
const _COLUMNS: ColDef[] = (() => {
    
    //* 그리드 컬럼 설정
    return [
        { field: 'type',            headerName: 'Type' },
        { field: 'permissionSets',  headerName: 'Permission Sets', },
        { field: 'description',     headerName: 'Description'},
    ];
})();