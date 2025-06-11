import style from './modal.module.css'
import { UI_Button, UI_Switch } from "@/compos/ui";
import type { FormComponent, FormValidationFn, GridModalCommParams, ResponseResult, RowItem } from ".";

export interface GridCreateParams extends GridModalCommParams {
    srcRow: RowItem;                        // 관련 row
    FormCompo: FormComponent;               // 폼 컨포넌트
    formValidationFn: FormValidationFn,     // 데이터 검증 함수
}

//* 컨텐츠 타입
const _CONT_TYPE = 'new';

/**
 * 추가 관련 모달
 */
export function gridCreate({
    conn, title, srcRow, callback, formValidationFn, FormCompo, apiFn, size
}: GridCreateParams){
    //* 추가 할 row 기본 값 데이터
    let row = {...srcRow};

    //* 컴포넌트에 사용될 키 값 (재 랜더링을 위함)
    let nodeKey = createNodeKey();

    //* 팝업창 유지 여부 (true: 유지, false: 안함)
    let isKeep = false;

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        conn.trigger('modal-content', (
            <FormCompo
                row={row} onSetData={onSetData} key={nodeKey}
                errMsg={msg} errCode={code}
            />
        ));
    }

    //* 데이터 설정
    const onSetData = (value: any, key: string) => {
        row[key] = value;
    };

    //* 팝업창 유지 여부 설정
    const onSetCreateMore = (checked: boolean) => {
        isKeep = checked;
    }

    //* 모달 설정
    conn.triggers({
        // 제목
        'modal-title': <div className={style['create-title']}>{title}</div>,
        // 내용
        'modal-content': <FormCompo key={nodeKey} row={row} onSetData={onSetData} />,
        // 모달 크기
        'modal-size': size ?? 'sm',
        // 모달 버튼 피드백
        'modal-feedback': async (key: string) => {
            // 에러 메시지 초기화
            conn.trigger('modal-errMsg', '');

            // Create 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                conn.trigger('modal-errMsg', 'Not processed.');
                return false;
            }

            // 로딩표기
            conn.trigger('modal-loading', true);

            // 처리 결과
            const res = await (async() => {
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
                    // JSON포맷의 에러일 경우
                    if( res.isErrJSON ){
                        formErrSend(res.msg.message, res.msg.code);
                    }
                    // 일반 문자열 에러일 경우
                    else {
                        conn.trigger('modal-errMsg', res.msg as string);
                    }

                    return false;
                }

                return true;
            })();

            //* 정상처리 되었을 때
            if( res ){
                callback();

                // 모달창 유지
                if( isKeep ){
                    // 초기 값, 재 랜더링을 위한 키 값 재설정
                    row = {...srcRow};
                    nodeKey = createNodeKey();

                    // 본문만 다시 불러오기
                    conn.trigger('modal-content', <FormCompo row={row} onSetData={onSetData} key={nodeKey} />);
                }

                // 모달창 닫기 (모달창 유지X)
                if( !isKeep ){
                    conn.trigger('modal-open', false);
                }
            }

            // 로딩 숨기기
            conn.trigger('modal-loading', false);
        },
        // 모달 하단 좌측 영역
        'modal-btmLeftSection': (
            <label className={style['create-more']}>
                <UI_Switch
                    defaultChecked={isKeep}
                    onChange={onSetCreateMore}
                />
                Add more
            </label>
        ),
        // 모달 버튼
        'modal-btns': {
            ok: <UI_Button type='primary'>Add</UI_Button>,
        },
        // 모달 열기
        'modal-open': true
    });
}

/**
 * 노드에 사용될 키 값
 */
function createNodeKey(){
    return (new Date().getTime()) +'-create-node';
}