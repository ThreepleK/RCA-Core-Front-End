import type { ColDef, GridApi } from "ag-grid-community";

import { GridBasic, GridConnPublic, type GridDeleteParams } from "@/compos/grid";
import { editViewStore } from "@/features/user-group/stores";
import { addMemberProcess } from "./members-add";
import { api_tabsMemberSave } from "@/features/user-group/apis";

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
    gridConn: GridConnPublic
){
    // 원본 row
    let srcRow = {};
    // 그리드에 보여줄 리스트
    let list = [];

    //* 리스트 불러오기
    const onListLoad = async () => {
        // 그리드에 리스트 전달
        gridConn.setList(list);
        // 로딩 끝
        gridConn.setLoading(false);
    };

    //* init
    (async () => {
        editViewStore.on('tab-members', async (row) => {
            // 로딩 시작
            gridConn.setLoading(true);

            // 저장시 필요한 데이터
            srcRow = null;
            srcRow = row;

            // 리스트 설정
            list = null;
            list = [...row.users];
            await onListLoad();
        });

        //* 저장 버튼
        editViewStore.on('save-members', async () => {
            // 리스트에서 추가 될 사용자 id만 가져오기
            const memberIds = list.map(r => r.id);

            // 사용자 저장 처리
            await api_tabsMemberSave(memberIds, srcRow);

            // 저장 이후 user group 그리드에 신호 전달
            editViewStore.trigger('tab-settings-update');
        });

        //* 사용자 추가 버튼
        editViewStore.on('add-members', async () => {
            // 사용자 추가 시 호출 될 함수
            const onAddMember = (addMembers: any[]) => {
                // 이미 추가 되어있는 id 모음
                const addedIds = list.map(r => r.id);

                // 중첩 되지않는 사용자만 추려오기
                const filterMember = addMembers
                    .filter(r => !addedIds.includes(r.id))
                    .map(r => ({
                        id: r.id,
                        username: r.username,
                        fullName: r.fullName,
                        status: r.status,
                        email: r.email,
                    }))
                ;
                
                // 추려온 사용자 1명 이상일 때만 추가
                if( filterMember.length > 0 ){
                    list.push( ...filterMember );
                }

                // 그리드에 불러오기
                onListLoad();
            }

            // 사용자 추가 모달
            addMemberProcess(onAddMember);
        });

        // Members 선택 삭제
        editViewStore.on('remove-members', async () => {
            // 그리드에서 선택된 row 가져오기
            const rows = gridApi.getSelectedRows();
            
            // 계정 삭제 모달
            gridConn.openDeleteModal({
                title: 'Remove member',
                content: 'Do you want to remove the selected users?',
                rows,
                callback: onListLoad,
                apiFn: async rows => {
                    // 제거 될 사용자 id만 가져오기
                    const memberIds = rows.map(r => r.id);

                    // 저장 처리
                    const res = await api_tabsMemberSave(memberIds, srcRow);

                    // 에러 없이 정상 처리 일 경우
                    if( !res.isErr ){
                        const filterList = list.filter(r => !memberIds.includes(r.id));
                        list = null;
                        list = filterList;
                    }

                    return res;
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
        { field: 'username',    headerName: 'ID' },
        { field: 'fullName',    headerName: 'Full name' },
        { field: 'email',       headerName: 'Email', },
        { field: 'status',      headerName: 'Status',       width: 100},
    ];
})();