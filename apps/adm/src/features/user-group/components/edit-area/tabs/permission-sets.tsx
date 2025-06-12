import type { ColDef, GridApi } from "ag-grid-community";

import { editViewStore } from "@/features/user-group/stores";
import { GridBasic } from "@/compos/grid";
import type { SectionStore } from "@/stores";
import { api_tabsPermissionList, api_tabsPermissionSave } from "@/features/user-group/apis";

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
    let isLoaded: boolean = false;      // User group에서 row가 불러온 뒤 여부
    let permissionIds: any = [];        // row에서 permission set의 id만 추림
    let srcRow: any = {};               // 원본 row

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
        //* 리스트 로드 → AgGrid row 업데이트
        gridConn.on('onRowDataUpdate', () => {
            // 준비가 되지 않았거나, 이미 한 경우
            if( !isLoaded ){ return; }
            isLoaded = false;

            // Permission Set 그리드의 id와 같으면 선택, 아니면 해제 처리
            gridApi.forEachNode(node => {
                const selected = permissionIds.includes(node.data.id);
                node.setSelected(selected);
            });
        });

        //* User group의 그리드에서 row 데이터 전달 
        editViewStore.on('tab-permission', async (row) => {
            // 원본 row
            srcRow = {...row};
            // 넘어온 그리드에서 permission 선택 id 가져오기
            permissionIds = row.permissionSets.map(r => r.id);
            // 준비 완료
            isLoaded = true;

            // Permission Set 그리드 리스트 가져오기
            await onListLoad();
        });

        //* 저장 하기
        editViewStore.on('save-permission', async () => {
            // 그리드에서 선택된 row 가져오기
            const permissionIds = gridApi.getSelectedRows().map(r => r.id);

            // 저장
            const res = await api_tabsPermissionSave(permissionIds, srcRow);

            // 저장 에러 모달
            if( res.isErr ){
                // json포맷의 에러일 경우만 메시지 설정
                const msg = res.isErrJSON ? res.msg.message : 'request failed';

                // 에러 메시지 모달 표기
                gridConn.trigger('nodata-modal', {
                    title: 'Save Error',
                    content: <>{msg}</>
                });
                return;
            }

            // 저장 이후 user group 그리드에 신호 전달
            editViewStore.trigger('tab-settings-update');
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
        { field: 'name',            headerName: 'Permission Sets', },
        { field: 'description',     headerName: 'Description'},
    ];
})();