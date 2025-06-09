import { UI_Button } from "@/compos/ui";
import type { FormComponent, FormValidationFn, GridModalCommParams, RowItem } from ".";

import style from './modal.module.css'

export interface GridEditParams extends GridModalCommParams {
    row: RowItem;                           // 관련 row
    FormCompo: FormComponent;               // form 컴포넌트
    formValidationFn: FormValidationFn,     // 데이터 검증 함수
}

//* 컨텐츠 타입
const _CONT_TYPE = 'mod';

/**
 * 편집 관련 모달
 */
export function gridEdit({
    conn, title, row, callback, formValidationFn, FormCompo, apiFn, size
}: GridEditParams){
    //* 편집 데이터
    const editDatas = {...row};

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        editDatas[key] = value;
    };

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        conn.trigger('modal-content', (
            <FormCompo
                row={row} onSetData={onSetData}
                errMsg={msg} errCode={code}
            />
        ));
    }

    // 모달 설정
    conn.triggers({
        // 제목
        'modal-title': <div className={style['edit-title']}>{title}</div>,
        // 내용
        'modal-content': <FormCompo row={row} onSetData={onSetData} />,
        // 모달 크기
        'modal-size': size ?? 'xl',
        // 모달 버튼 피드백
        'modal-feedback': async (key: string) => {
            // 에러 메시지 초기화
            conn.trigger('modal-errMsg', '');

            // Cancel 버튼
            if( key === 'cancel' ){
                conn.trigger('modal-open', false);
                return false;
            }

            // Save 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                conn.trigger('modal-errMsg', 'Not processed.');
                return false;
            }

            // 로딩표기
            conn.trigger('modal-loading', true);

            // 처리 결과
            const result = await (async() => {
                // 데이터 검증
                const validate = await formValidationFn(_CONT_TYPE, editDatas);

                // 검증 에러가 있을 경우
                if( validate.isErr ){
                    formErrSend(validate.msg, validate.code);
                    return false;
                }
                
                // 추가 처리
                const res = await apiFn([editDatas]);

                // 에러가 있을 경우
                if( res.isErr ){
                    conn.trigger('modal-errMsg', res.msg);
                    return false;
                }

                return true;
            })();

            //* 정상처리 되었을 때
            if( result ){
                callback();
                conn.trigger('modal-open', false);
            }

            // 로딩 숨기기
            conn.trigger('modal-loading', false);
        },
        // 모달 하단 좌측 영역
        'modal-btmLeftSection': null,
        // 모달 버튼
        'modal-btns': {
            cancel: <UI_Button>Cancel</UI_Button>,
            ok: <UI_Button type='primary'>Save</UI_Button>,
        },
        // 모달 열기
        'modal-open': true
    });
}