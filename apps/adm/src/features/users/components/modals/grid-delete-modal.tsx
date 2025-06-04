import { useCommModalStore } from "@/compos/modal";
import { UI_Button } from "@/compos/ui";
import { api_deleteItems } from "../../apis";

import style from './grid-modal.module.css'

/**
 * [모달] 삭제
 */
export function gridDeleteModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
) {
    // 처리할 아이템이 1개도 없을 때
    if( rows === null || (Array.isArray(rows) && rows.length === 0) ){
        noDataModal();
        return;
    }

    // 처리
    deleteModal(rows, callback);
}

/**
 * [모달] 삭제할 아이템이 없을 때
 */
function noDataModal(){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['delete-title']}>Delete</div>
        ),
        // 내용
        content: (
            <div className={style['modal-content']}>
                Please select 1 or more items to delete.
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
 * [모달] 삭제할 아이템이 있을 때
 */
function deleteModal(
    rows: any,                       // 관련 row
    callback: (data?: any) => void,  // 확인 콜백
){
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['delete-title']}>Delete</div>
        ),
        // 내용
        content: (
            <div className={style['modal-content']}>
                Are you sure you want to delete?<br />
                This action cannot be undone.
            </div>
        ),
        // 버튼 표기
        buttons: {
            delete: <UI_Button type='primary' className={style['delete-button']}>Delete</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await deleteAction(key, rows);
            console.log('결과', result);

            // 모달창 닫기 (정상처리)
            if( result ){
                callback(result);
                setOpen(false);
            }

            // 로딩 숨기기
            setLoading(false);
        },
        size: 'sm',
    });

    //* 모달 열기
    setOpen(true);
}

/**
 * 처리
 */
async function deleteAction(key: string, rows: any){
    const { setErrMsg } = useCommModalStore.getState();

    // 에러 메시지 초기화
    setErrMsg('');

    // delete 버튼이 아니면 건너 뜀
    if( key !== 'delete' ){
        setErrMsg('Not processed.');
        return false;
    }

    // id 리스트로 데이터로 가공
    const rmListIds = rows.map(r => r.id);

    // 삭제 처리
    const res = await api_deleteItems(rmListIds);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}