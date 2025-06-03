import { useCommModalStore } from "@/compos/modal";
import { FormEditContent, formValidate } from "../form";
import { api_updateItems } from "../../apis";

import style from './grid-edit-modal.module.css'
import { UI_Button } from "@/compos/ui";

//* 컨텐츠 타입
const _CONT_TYPE = 'mod';

/**
 * [모달] 수정
 */
export function gridEditModal(
    row: any,                           // 관련 row
    callback: (data?: any) => void      // 확인 콜백
) {
    const { setOpen, setContent, setLoading } = useCommModalStore.getState();

    //* 편집 데이터
    const editDatas = {...row};

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        editDatas[key] = value;
    };
  
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['edit-title']}>Edit Details</div>
        ),
        // 내용
        content: (
            <FormEditContent type={_CONT_TYPE} row={editDatas} onSetData={onSetData} />
        ),
        // 버튼 표기
        buttons: {
            cancel: <UI_Button>Cancel</UI_Button>,
            ok: <UI_Button type='primary'>Save</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            //* 취소 버튼 
            if( key === 'cancel' ){
                setOpen(false);
                return;
            }

            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await editAction(key, editDatas, onSetData);
            console.log('결과', result);
            
            // 모달창 닫기 (정상처리)
            if( result ){
                callback(result);
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
 * 처리
 * @param key 버튼 키 코드
 * @param row 추가 처리 할 row 데이터
 * @param onSetData 데이터 설정에 사용된 함수
 */
async function editAction(
    key: string,
    row: any,
    onSetData: (value: any, key: string) => void,
){
    const { setOnlyContent, setErrMsg } = useCommModalStore.getState();

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        setOnlyContent(
            <FormEditContent
                type={_CONT_TYPE} errMsg={msg} errCode={code}
                row={row} onSetData={onSetData}
            />
        );
    }

    // 에러 메시지 초기화
    setErrMsg('');

    // Save 버튼이 아니면 건너 뜀
    if( key !== 'ok' ){
        setErrMsg('Not processed.');
        return false;
    }

    // 데이터 검증
    const validate = await formValidate(_CONT_TYPE, row);

    // 검증 에러가 있을 경우
    if( validate.isErr ){
        formErrSend(validate.msg, validate.code);
        return false;
    }
    
    console.log('row', row);

    // 수정 처리
    const res = await api_updateItems([row]);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}