import type { ReactNode } from "react";
import { useCommModalStore } from "@/compos/modal";
import { UI_Button } from "@/compos/ui";

import type { GridModalCommParams, RowItem } from ".";
import { noDataModal } from "./nodata-modal";

import style from './modal.module.css'

export interface GridUpdateModalParams extends GridModalCommParams {
    rows: RowItem[];            // 관련 row
    content: string|ReactNode;  // 모달에 보여줄 내용
}

/**
 * [모달] 업데이트 처리
 */
export function gridUpdateModal(params: GridUpdateModalParams) {
    // 처리할 아이템이 1개도 없을 때
    if( params.rows === null || (Array.isArray(params.rows) && params.rows.length === 0) ){
        noDataModal(params.title);
        return;
    }

    // 처리
    confirmModal(params);
}

/**
 * [모달] 처리 할 아이템이 있을 때
 */
function confirmModal({
    title, content, callback, apiFn, rows
}: GridUpdateModalParams) {
    const { setOpen, setContent, setLoading, setErrMsg } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['update-title']}>{title}</div>
        ),
        // 내용
        content: (
            <div className={style['modal-content']}>{content}</div>
        ),
        // 버튼 표기
        buttons: {
            ok: <UI_Button type='primary' className={style['warning-button']}>Update</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 에러 메시지 초기화
            setErrMsg('');

            // Update 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                setErrMsg('Not processed.');
                return;
            }

            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await (async() => {
                // 비활성화 내용으로 처리
                const res = await apiFn(rows);

                // 에러가 있을 경우
                if( res.isErr ){
                    setErrMsg(res.msg);
                    return false;
                }

                return true;
            })();
            
            // 모달창 닫기 (정상처리)
            if( result ){
                setOpen(false);
                callback();
            }

            // 로딩 숨기기
            setLoading(false);
        },
        size: 'md',
    });

    //* 모달 열기
    setOpen(true);
}