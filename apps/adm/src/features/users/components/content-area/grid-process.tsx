import { useEffect } from "react";
import { useLocalSendEvent } from "../../stores";
import type { GridApi } from "ag-grid-community";
import { gridCreateModal } from "../modals";

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
                    case 'selected-deactive': {
                        if( !gridApi ){ return; }
                        console.log('gridApi', gridApi.getSelectedRows())
                    } break;

                    // 선택 항목 삭제
                    case 'selected-delete': {
                        if( !gridApi ){ return; }
                        console.log('gridApi', gridApi.getSelectedRows())
                    } break;

                    // 수정
                    case 'edit': {
                        console.log('edit', eVal);
                    } break;

                    // 삭제
                    case 'delete': {
                        console.log('delete', eVal);
                    } break;
                }
            }
        )

        // 이벤트 UnMount 시 구독 취소
        return unSub;
    }, []);

    return <></>;
}