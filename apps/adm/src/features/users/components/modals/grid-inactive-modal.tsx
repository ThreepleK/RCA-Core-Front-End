import { useCommModalStore } from "@/compos/modal";
import { api_updateItems } from "../../apis";

import style from './grid-modal.module.css'
import { UI_Button } from "@/compos/ui";

/**
 * [모달] 회원 비활성화 처리
 */
export function gridInactiveModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    // 처리할 아이템이 1개도 없을 때
    if( rows === null || (Array.isArray(rows) && rows.length === 0) ){
        noDataModal();
        return;
    }

    // 처리
    inactiveModal(rows, callback);
}

/**
 * [모달] 처리 할 아이템이 없을 때
 */
function noDataModal(){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['inactive-title']}>Deactive member</div>
        ),
        // 내용
        content: (
            <div className={style['madal-content']}>
                Please select 1 or more items to Deactive member.
            </div>
        ),
        // 버튼 표기
        buttons: {
            confirm: <UI_Button type='primary'>Confirm</UI_Button>,
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
 * [모달] 처리 할 아이템이 있을 때때
 */
export function inactiveModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['inactive-title']}>Deactive member</div>
        ),
        // 내용
        content: (
            <div className={style['madal-content']}>
                Do you want to disable all selected users?
            </div>
        ),
        // 버튼 표기
        buttons: {
            ok: <UI_Button type='primary' className={style['warning-button']}>Inactive</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await inactiveAction(key, rows);
            console.log('결과', result);

            callback(result);

            // 모달창 닫기 (정상처리)
            if( result ){
                setOpen(false);
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
 * 비활성화 처리
 */
async function inactiveAction(key: string, rows: any[]){
    const { setErrMsg } = useCommModalStore.getState();

    // Deactive 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        setErrMsg('Not processed.');
        return false;
    }

    // 비활성화 데이터로 가공
    const reDatas = rows.map(r => ({
        ...r,
        status: 'inactive'
    }));

    console.log('reDatas', reDatas);

    // 비활성화 내용으로 처리
    const res = await api_updateItems(reDatas);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}