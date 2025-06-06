import type { GridApi } from "ag-grid-community";
import { editViewStore, useLocalSendEvent } from "../../stores";
import { api_createItem, api_deleteItems, api_list, api_updateItems } from "../../apis";
import { gridCreateModal, gridUpdateModal, gridDeleteModal } from "@/compos/grid";
import { FormCreateContent, formValidate } from "../form";
import type { SectionStore } from "@/stores";

/**
 * 그리드 프로세스 처리
 * @param gridApi AgGrid api
 * @param gridConn 그리드에 전달할 이벤트 처리 용
 */
export function gridProcess(
    gridApi: GridApi<any>,
    gridConn: SectionStore
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
                gridCreateModal({
                    title: 'Add user group1',
                    srcRow: {
                        groupName: '',
                        description: '',
                    },
                    FormCompo: FormCreateContent,
                    formValidationFn: formValidate,
                    apiFn: api_createItem,
                    callback: onListLoad,
                });                                                   
            } break;

            // 선택 항목 활성화
            case 'selected-active': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();
                // 계정 활성화 모달
                gridUpdateModal({
                    title: 'Active member',
                    content: 'Do you want to activate the selected users?',
                    rows,
                    callback: onListLoad,
                    apiFn: rows => api_updateItems('status-active', rows)
                });
            } break;

            // 선택 항목 비활성화
            case 'selected-inactive': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();
                // 계정 비활성화 모달
                gridUpdateModal({
                    title: 'Inactive member',
                    content: 'Do you want to inactivate the selected users?',
                    rows,
                    callback: onListLoad,
                    apiFn: rows => api_updateItems('status-inactive', rows)
                });
            } break;

            // 선택 항목 삭제
            case 'selected-delete': {
                if( !gridApi ){ return; }

                // 그리드에서 선택된 row 가져오기
                const rows = gridApi.getSelectedRows();
                // 삭제 모달
                gridDeleteModal({
                    title: 'Delete',
                    content: <>
                        Are you sure you want to delete?<br />
                        This action cannot be undone.
                    </>,
                    rows,
                    callback: onListLoad,
                    apiFn: api_deleteItems,
                });
            } break;

            // 수정
            case 'edit': {
                // 그리드에서 전달한 row 데이터
                const row = eVal as any;
                
                // (순차 처리) 수정 화면 drawer
                editViewStore.triggers({
                    'edit-title': row?.groupName,   // 제목 설정
                    'edit-showTab': 'members',      // 처음 보여줄 탭 key
                    'tab-members': {...row},        // Members 탭에 보낼 데이터
                    'tab-permission': {...row},     // Permission Sets 탭에 보낼 데이터
                    'tab-settings': {...row},       // Settings 탭에 보낼 데이터
                    'edit-open': true,              // drawer 열기
                });
            } break;

            // 삭제
            case 'delete': {
                // 그리드에서 전달한 row 데이터
                const row = eVal as any;
                // 삭제 모달
                gridDeleteModal({
                    title: 'Delete',
                    content: <>
                        Are you sure you want to delete?<br />
                        This action cannot be undone.
                    </>,
                    rows: [row],
                    callback: onListLoad,
                    apiFn: api_deleteItems,
                });
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