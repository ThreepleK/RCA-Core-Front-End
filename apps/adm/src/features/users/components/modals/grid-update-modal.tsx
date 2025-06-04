import { useCommModalStore } from "@/compos/modal";
import { api_updateItems } from "../../apis";

import style from './grid-modal.module.css'
import { UI_Button } from "@/compos/ui";
import type { ReactNode } from "react";

/**
 * [모달] 업데이트 처리
 */
export function gridUpdateModal({rows, callback, updateType, title, msg}: {
    rows: any[];                        // 관련 row
    callback: (data?: any) => void;     // 확인 콜백
    updateType: string;                 // 업데이트 타입
    title: string|ReactNode,            // 모달에 보여줄 타이틀
    msg: string|ReactNode,              // 메시지
}) {
    // 처리할 아이템이 1개도 없을 때
    if( rows === null || (Array.isArray(rows) && rows.length === 0) ){
        noDataModal(title);
        return;
    }

    // 처리
    confirmModal(title, msg, updateType, rows, callback);
}

/**
 * [모달] 처리 할 아이템이 없을 때
 */
function noDataModal(
    title: string | ReactNode,
){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['update-title']}>{title}</div>
        ),
        // 내용
        content: (
            <div className={style['modal-content']}>
                Please select one or more items.
            </div>
        ),
        // 버튼 표기
        buttons: {
            confirm: <UI_Button type='primary' className={style['warning-button']}>Confirm</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            setOpen(false);
        },
        size: 'xs',
    });

    //* 모달 열기
    setOpen(true);
}

/**
 * [모달] 처리 할 아이템이 있을 때
 */
export function confirmModal(
    title: string | ReactNode,
    content: string | ReactNode,
    updateType: string,
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
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
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await processAction(updateType, key, rows);
            console.log('결과', result);
            
            // 모달창 닫기 (정상처리)
            if( result ){
                setOpen(false);
                callback(result);
            }

            // 로딩 숨기기
            setLoading(false);
        },
        size: 'md',
    });

    //* 모달 열기
    setOpen(true);
}

/**
 * 처리
 */
async function processAction(updateType: string, key: string, rows: any[]){
    const { setErrMsg } = useCommModalStore.getState();

    // Deactive 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        setErrMsg('Not processed.');
        return false;
    }

    // 비활성화 데이터로 가공
    const reDatas = UpdateRows(updateType, rows);

    // 처리할 될 rows가 없을 경우 모달에 에러
    if( reDatas.length === 0 ){
        setErrMsg('It is in a form that cannot be processed.');
        return false;
    }

    // 비활성화 내용으로 처리
    const res = await api_updateItems(reDatas);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}

/**
 * 서버에 보내줄 형태로 가공처리
 */
function UpdateRows(type: string, rows: any[]){
    switch( type ){
        //* status 활성화
        case 'status-active': {
            return rows.map(r => ({
                ...r,
                status: 'active'
            }));
        }

        //* status 비활성화
        case 'status-inactive': {
            return rows.map(r => ({
                ...r,
                status: 'inactive'
            }));
        }
    };

    return [];
}