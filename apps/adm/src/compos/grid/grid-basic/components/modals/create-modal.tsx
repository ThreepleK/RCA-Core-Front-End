import { useCommModalStore } from "@/compos/modal";

import style from './modal.module.css'
import { UI_Button, UI_Switch } from "@/compos/ui";
import type { FormComponent, FormValidationFn, GridModalCommParams, ResponseResult, RowItem } from ".";

const _CONT_TYPE = 'new';

export interface GridCreateModalParams extends GridModalCommParams {
    srcRow: RowItem;                        // 관련 row
    FormCompo: FormComponent;               // 데이터 검증 함수
    formValidationFn: FormValidationFn,     // 데이터 검증 함수
}

/**
 * 추가 관련 모달
 */
export function gridCreateModal({
    title, srcRow, callback, formValidationFn, FormCompo, apiFn
}: GridCreateModalParams){
    // 모달
    const { setOpen, setContent, setOnlyContent, setLoading, setErrMsg } = useCommModalStore.getState();

    //* 추가 할 row 기본 값 데이터
    let row = {...srcRow};

    //* 컴포넌트에 사용될 키 값 (재 랜더링을 위함)
    let nodeKey = createNodeKey();

    //* 팝업창 유지 여부 (true: 유지, false: 안함)
    let isKeep = false;

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        setOnlyContent(
            <FormCompo
                row={row} onSetData={onSetData} key={nodeKey}
                errMsg={msg} errCode={code}
            />
        );
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
    setContent({
        // 제목
        title: (
            <div className={style['create-title']}>{title}</div>
        ),
        // 내용
        content: (
            <FormCompo key={nodeKey} row={row} onSetData={onSetData} />
        ),
        // 하단 왼쪽 영역
        bottomLeftSection: (
            <label className={style['create-more']}>
                <UI_Switch
                    defaultChecked={isKeep}
                    onChange={onSetCreateMore}
                />
                Add more
            </label>
        ),
        // 버튼 표기
        buttons: {
            ok: <UI_Button type='primary'>Add</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 에러 메시지 초기화
            setErrMsg('');

            // Create 버튼이 아니면 건너 뜀
            if( key !== 'ok' ){
                setErrMsg('Not processed.');
                return false;
            }

            // 로딩표기
            setLoading(true);

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
                    setErrMsg(res.msg);
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
                    setOnlyContent(<FormCompo row={row} onSetData={onSetData} key={nodeKey} />);
                }

                // 모달창 닫기 (모달창 유지X)
                if( !isKeep ){
                    setOpen(false);
                }
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
 * 노드에 사용될 키 값
 */
function createNodeKey(){
    return (new Date().getTime()) +'-create-node';
}