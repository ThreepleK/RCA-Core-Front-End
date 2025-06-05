import { useCommModalStore } from "@/compos/modal";
import { UI_Button } from "@/compos/ui";
import type { FormComponent, FormValidationFn, GridModalCommParams, RowItem } from ".";

import style from './modal.module.css'

//* 컨텐츠 타입
const _CONT_TYPE = 'mod';

export interface GridEditModalParams extends GridModalCommParams {
    row: RowItem;                           // 관련 row
    FormCompo: FormComponent;               // form 컴포넌트
    formValidationFn: FormValidationFn,     // 데이터 검증 함수
}

/**
 * 편집 관련 모달
 */
export function gridEditModal({
    title, row, callback, formValidationFn, FormCompo, apiFn
}: GridEditModalParams){
    const { setOpen, setContent, setLoading, setOnlyContent, setErrMsg } = useCommModalStore.getState();

    //* 편집 데이터
    const editDatas = {...row};

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        editDatas[key] = value;
    };

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        setOnlyContent(
            <FormCompo
                row={row} onSetData={onSetData}
                errMsg={msg} errCode={code}
            />
        );
    }

    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['edit-title']}>{title}</div>
        ),
        // 내용
        content: (
            <FormCompo row={row} onSetData={onSetData} />
        ),
        // 버튼 표기
        buttons: {
            cancel: <UI_Button>Cancel</UI_Button>,
            ok: <UI_Button type='primary'>Save</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 에러 메시지 초기화
            setErrMsg('');

            // Cancel 버튼
            if( key === 'cancel' ){
                setOpen(false);
                return false;
            }

            // Save 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                setErrMsg('Not processed.');
                return false;
            }

            // 로딩표기
            setLoading(true);

            // 처리 결과
            const result = await (async() => {
                // 데이터 검증
                const validate = await formValidationFn(_CONT_TYPE, row);

                // 검증 에러가 있을 경우
                if( validate.isErr ){
                    formErrSend(validate.msg, validate.code);
                    return false;
                }
                
                // 추가 처리
                const res = await apiFn([row]);

                // 에러가 있을 경우
                if( res.isErr ){
                    setErrMsg(res.msg);
                    return false;
                }

                return true;
            })();

            //* 정상처리 되었을 때
            if( result ){
                callback();
                setOpen(false);
            }

            // 로딩 숨기기
            setLoading(false);
        },
        size: 'xl',
    });

    //* 모달 열기
    setOpen(true);
}