import type { ReactNode } from "react";
import { UI_Button } from "@/compos/ui";
import type { GridModalCommParams, RowItem } from ".";

import style from './modal.module.css'

export interface GridUpdateParams extends GridModalCommParams {
    rows: RowItem[];            // 관련 row
    content: string|ReactNode;  // 모달에 보여줄 내용
}

/**
 * [모달] 업데이트 처리
 */
export function gridUpdate(params: GridUpdateParams) {
    // 처리할 아이템이 1개도 없을 때
    if( params.rows === null || (Array.isArray(params.rows) && params.rows.length === 0) ){
        params.conn.trigger('nodata-modal', {
            title: params.title
        });
        return;
    }

    // 처리
    confirmModal(params);
}

/**
 * [모달] 처리 할 아이템이 있을 때
 */
function confirmModal({
    conn, title, content, callback, apiFn, rows
}: GridUpdateParams) {

    //* 모달 설정
    conn.triggers({
        // 제목
        'modal-title': <div className={style['update-title']}>{title}</div>,
        // 내용
        'modal-content': <div className={style['modal-content']}>{content}</div>,
        // 모달 크기
        'modal-size': 'md',
        // 모달 버튼 피드백
        'modal-feedback': async (key: string) => {
            // 에러 메시지 초기화
            conn.trigger('modal-errMsg', '');

            // Update 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                conn.trigger('modal-errMsg', 'Not processed.');
                return;
            }

            // 로딩표기
            conn.trigger('modal-loading', true);

            // 처리 결과
            const result = await (async() => {
                // 비활성화 내용으로 처리
                const res = await apiFn(rows);

                // 에러가 있을 경우
                if( res.isErr ){
                    conn.trigger('modal-errMsg', res.msg as string); 
                    return false;
                }

                return true;
            })();
            
            // 모달창 닫기 (정상처리)
            if( result ){
                conn.trigger('modal-open', false);
                callback();
            }

            // 로딩 숨기기
            conn.trigger('modal-loading', false);
        },
        // 모달 하단 좌측 영역
        'modal-btmLeftSection': null,
        // 모달 버튼
        'modal-btns': {
            ok: <UI_Button type='primary' className={style['update-button']}>Update</UI_Button>,
        },
        // 모달 열기
        'modal-open': true
    });
}