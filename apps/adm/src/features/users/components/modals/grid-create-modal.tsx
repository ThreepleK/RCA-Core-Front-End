import { useCommModalStore } from "@/compos/modal";
import { UI_Button, UI_Switch } from "@/compos/ui";
import { FormEditContent, formValidate } from "../form";
import { api_createItem } from "../../apis";

import style from './grid-modal.module.css'

//* 컨텐츠 타입
const _CONT_TYPE = 'new';

/**
 * [모달] 추가
 */
export function gridCreateModal(
    callback: (data?: any) => void      // 확인 콜백
) {
    const { setOpen, setContent, setOnlyContent, setLoading } = useCommModalStore.getState();

    //* 추가 할 row 기본 값 데이터
    const srcRow = {
        username: '',
        fullName: '',
        email: '',
        status: 'inactive',
        userGroup: [],
        permission: [],
    };
    let row = {...srcRow};

    //* 컴포넌트에 사용될 키 값 (재 랜더링을 위함)
    let nodeKey = createNodeKey();

    //* 팝업창 유지 여부 (true: 유지, false: 안함)
    let isKeep = false;

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
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
            <div className={style['create-title']}>Create User</div>
        ),
        // 내용
        content: (
            <FormEditContent type={_CONT_TYPE} row={row} onSetData={onSetData} key={nodeKey} />
        ),
        // 하단 왼쪽 영역
        bottomLeftSection: (
            <label className={style['create-more']}>
                <UI_Switch
                    defaultChecked={isKeep}
                    onChange={onSetCreateMore}
                />
                Create more
            </label>
        ),
        // 버튼 표기
        buttons: {
            ok: <UI_Button type='primary'>Create</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            // 로딩표기
            setLoading(true);

            // 처리 결과
            const res = await createAction(key, row, onSetData, nodeKey);

            //* 정상처리 되었을 때
            if( res ){
                callback();

                // 모달창 유지
                if( isKeep ){
                    // 초기 값, 재 랜더링을 위한 키 값 재설정
                    row = {...srcRow};
                    nodeKey = createNodeKey();

                    // 본문만 다시 불러오기
                    setOnlyContent(<FormEditContent type={_CONT_TYPE} row={row} onSetData={onSetData} key={nodeKey} />);
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

/**
 * 처리
 * @param key 버튼 키 코드
 * @param row 추가 처리 할 row 데이터
 * @param onSetData 데이터 설정에 사용된 함수
 * @param nodeKey 폼 컴포넌트 사용 중인 키 값
 */
async function createAction(
    key: string,
    row: any,
    onSetData: (value: any, key: string) => void,
    nodeKey: string,
): Promise<boolean> {
    const { setOnlyContent, setErrMsg } = useCommModalStore.getState();

    // 에러 메시지 전달
    const formErrSend = (msg: string, code: string) => {
        setOnlyContent(
            <FormEditContent
                type={_CONT_TYPE} errMsg={msg} errCode={code}
                row={row} onSetData={onSetData} key={nodeKey}
            />
        );
    }

    // 에러 메시지 초기화
    setErrMsg('');

    // Create 버튼이 아니면 건너 뜀
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

    // 추가 처리
    const res = await api_createItem([row]);

    // 에러가 있을 경우
    if( res.isErr ){
        setErrMsg(res.msg);
        return false;
    }

    return true;
}