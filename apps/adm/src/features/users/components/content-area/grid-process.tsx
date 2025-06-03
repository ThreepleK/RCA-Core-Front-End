import { useEffect } from "react";
import { useLocalSendEvent } from "../../stores";
import type { GridApi } from "ag-grid-community";
import { gridCreateModal, gridDeleteModal, gridEditModal, gridInactiveModal } from "../modals";

/**
 * 그리드 프로세스 처리
 */
export function GridProcess(){

    useEffect(() => {
        //* 그리드 제어용 api
        let gridApi: GridApi = null;

        //* 이벤트 구독 처리
        const unSub = useLocalSendEvent.subscribe(
            s => s.eKey,
            (eKey: string) => {
                // 이벤트 키가 초기화 상태면 처리 안함
                if( eKey === null ){ return; }

                // 이벤트 관련 값, 함수 가져오기
                const { eVal, clean } = useLocalSendEvent.getState();

                // 이벤트 값 초기화
                clean();

                switch(eKey){
                    // 그리드 준비 (API 설정)
                    case 'ready': {
                        gridApi = eVal as GridApi;
                    } break;

                    // 추가
                    case 'create': {
                        gridCreateModal(() => {
                            console.log('----')
                        });
                    } break;

                    // 선택 항목 비활성화
                    case 'selected-inactive': {
                        if( !gridApi ){ return; }

                        // 그리드에서 선택된 row 가져오기
                        const rows = gridApi.getSelectedRows()
                        // 계정 비활성화 모달
                        gridInactiveModal(rows, () => {});
                    } break;

                    // 선택 항목 삭제
                    case 'selected-delete': {
                        if( !gridApi ){ return; }

                        // 그리드에서 선택된 row 가져오기
                        const rows = gridApi.getSelectedRows()
                        // 삭제 모달
                        gridDeleteModal(rows, () => {})
                    } break;

                    // 수정
                    case 'edit': {
                        // 그리드에서 전달한 row 데이터
                        const row = eVal as any;
                        // 수정 모달
                        gridEditModal(row, () => {})
                    } break;

                    // 삭제
                    case 'delete': {
                        // 그리드에서 전달한 row 데이터
                        const row = eVal as any;
                        // 삭제 모달
                        gridDeleteModal([row], () => {})
                    } break;
                }
            }
        )

        // 이벤트 UnMount 시 구독 취소
        return unSub;
    }, []);

    return <></>;
}