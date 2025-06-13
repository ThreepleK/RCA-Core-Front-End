import type { GridApi } from "ag-grid-community";
import { useLocalSendEvent } from "../../stores";
import { api_createItem, api_deleteItems, api_list } from "../../apis";
import type { GridConnMap, GridCreateParams, GridDeleteParams, GridEditParams } from "@/compos/grid";
import { FormClone, formCloneValidate, FormCreateContent, formValidate } from "../form";
import type { SectionStore } from "@/stores";
/**
 * 그리드 프로세스 처리
 * @param gridApi AgGrid api
 * @param gridConn 그리드에 전달할 이벤트 처리 용
 */
export function gridProcess(
    gridApi: GridApi<any>,
    gridConn: SectionStore<GridConnMap>
){
    
    //* 리스트 불러오기
    const onListLoad = async () => {
        // 로딩 시작
        gridConn.trigger('loading', true);

        // 리스트 가져오기
        const res = await api_list();

        // 그리드에 리스트 전달
        gridConn.trigger('list', res);

        // 로딩 끝
        gridConn.trigger('loading', false);
    };

    //* User 구독 이벤트
    const onSubscribe = (eKey: string) => {
        // 이벤트 키가 초기화 상태면 처리 안함
        if( eKey === null ){ return; }

        // 이벤트 관련 값, 함수 가져오기
        const { eVal, clean } = useLocalSendEvent.getState();

        // 이벤트 값 초기화
        clean();

        switch( eKey ){
            // 추가
            case 'create': {
                gridConn.trigger('create-modal', {
                    title: 'Add permission set',
                    srcRow: {
                        name: '',
                        predefined: 'N',
                        assignedApps: [],
                        userGroups: 0,
                        users: 0,
                        description: '',
                        permissionList: {
                            systemAdmin: [],
                            meta: []
                        }
                    },
                    size: 'xl',
                    FormCompo: FormCreateContent,
                    formValidationFn: formValidate,
                    apiFn: api_createItem,
                    callback: onListLoad,
                } as GridCreateParams);
            } break;

            // 선택 항목 복제
            case 'selected-clone': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();

                // 선택 항목 0 or 2개 이상일 경우, 경고 메시지
                if( rows.length === 0 || rows.length >= 2 ){
                    gridConn.trigger('nodata-modal', {
                        title: 'Clone user group',
                        content: 'Please select only one item to clone.'
                    });
                    return;
                }

                // 그룹 복제 편집 모달
                gridConn.trigger('edit-modal', {
                    title: 'Clone user group',
                    row: {
                        groupName: rows[0].groupName,
                    },
                    FormCompo: FormClone,
                    formValidationFn: formCloneValidate,
                    callback: onListLoad,
                    apiFn: async editRows => {
                        const resRow = {...rows[0], ...editRows[0]};
                        console.log('resRow', resRow);

                        return new Promise(resolve => {
                            const res = {
                                isErr: false,
                                msg: '',
                                res: null,
                            };

                            resolve(res as any);
                        });
                    },
                    size: 'sm'
                } as GridEditParams);
            } break;

            // 선택 항목 삭제
            case 'selected-delete': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();
                // 삭제 모달
                gridConn.trigger('delete-modal', {
                    title: 'Delete',
                    content: <>
                        Are you sure you want to delete?<br />
                        This action cannot be undone.
                    </>,
                    rows,
                    callback: onListLoad,
                    apiFn: api_deleteItems,
                } as GridDeleteParams);
            } break;

            // 수정
            case 'edit': {
                // 그리드에서 전달한 row 데이터
                const row = eVal as any;
                
            } break;

            // 삭제
            case 'delete': {
                // 그리드에서 전달한 row 데이터
                const row = eVal as any;
                // 삭제 모달
                gridConn.trigger('delete-modal', {
                    title: 'Delete',
                    content: <>
                        Are you sure you want to delete?<br />
                        This action cannot be undone.
                    </>,
                    rows: [row],
                    callback: onListLoad,
                    apiFn: api_deleteItems,
                } as GridDeleteParams);
            } break;
        }
    }

    //* init
    (async() => {
        // 리스트 가져오기
        await onListLoad();
    })();

    // 구독 설정 (local, grid)
    const unSubLocal = useLocalSendEvent.subscribe(s => s.eKey, onSubscribe);

    //* UnMount 시 구독 취소
    return () => {
        unSubLocal();
    };
}