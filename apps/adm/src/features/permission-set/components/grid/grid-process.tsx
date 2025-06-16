import type { GridApi } from "ag-grid-community";
import { useLocalSendEvent } from "../../stores";
import { api_cloneItem, api_createItem, api_deleteItems, api_list, api_updateItems } from "../../apis";
import type { GridConnPublic, GridCreateParams, GridDeleteParams, GridEditParams } from "@/compos/grid";
import { FormClone, formCloneValidate, FormCreateContent, formValidate } from "../form";

/**
 * 그리드 프로세스 처리
 * @param gridApi AgGrid api
 * @param gridConn 그리드에 전달할 이벤트 처리 용
 */
export function gridProcess(
    gridApi: GridApi<any>,
    gridConn: GridConnPublic
){
    
    //* 리스트 불러오기
    const onListLoad = async () => {
        // 로딩 시작
        gridConn.setLoading(true);

        // 리스트 가져오기
        const res = await api_list();

        // 그리드에 리스트 전달
        gridConn.setList(res);

        // 로딩 끝
        gridConn.setLoading(false);
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
                gridConn.openCreateModal({
                    title: 'Add permission set',
                    srcRow: {
                        name: '',
                        description: '',
                        predefined: false,
                        permissions: []
                    },
                    size: 'xl',
                    FormCompo: (props) =>
                        <FormCreateContent {...props} type='new' />,
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
                    gridConn.openWarningModal({
                        title: 'Clone user group',
                        content: 'Please select only one item to clone.'
                    });
                    return;
                }

                // 그룹 복제 편집 모달
                gridConn.openEditModal({
                    title: 'Clone user group',
                    row: {
                        name: rows[0].name,
                        description: rows[0].description,
                    },
                    FormCompo: FormClone,
                    formValidationFn: formCloneValidate,
                    callback: onListLoad,
                    apiFn: editRows => api_cloneItem(rows[0].id, editRows[0]),
                    size: 'sm'
                } as GridEditParams);
            } break;

            // 선택 항목 삭제
            case 'selected-delete': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();
                // 삭제 모달
                gridConn.openDeleteModal({
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
                
                gridConn.openEditModal({
                    title: 'Edit permission set',
                    row,
                    size: 'xl',
                    FormCompo: (props) =>
                        <FormCreateContent {...props} type='mod' />,
                    formValidationFn: formValidate,
                    apiFn: rows => api_updateItems('single', rows),
                    callback: onListLoad,
                } as GridEditParams);
            } break;

            // 삭제
            case 'delete': {
                // 그리드에서 전달한 row 데이터
                const row = eVal as any;
                // 삭제 모달
                gridConn.openDeleteModal({
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
        // 그리드 row 선택 타입 설정
        gridConn.setRowSelectionType('singleRow');
        
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