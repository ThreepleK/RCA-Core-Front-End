import { useEffect, useRef, useState } from "react";
import { editViewStore } from "@/features/user-group/stores";
import { FormCreateContent, formValidate } from "../../form";
import { api_updateItem } from "@/features/user-group/apis";
import type { ApiResult } from "@/utils";

/**
 * [User Group > Edit]
 * Tab > Settings
 */
export function TabSettings(){
    const dataRef = useRef({});
    const [raw, setRaw] = useState({});
    const [formKey, setFormKey] = useState(reRenderKey())
    const [errMsg, setErrMsg] = useState('');
    const [errCode, setErrCode] = useState('');

    useEffect(() => {
        //* 그리드 -> 데이터 전달 이벤트
        editViewStore.on('tab-settings', (row) => {
            dataRef.current = {...row};
            setRaw(row);
            setFormKey(reRenderKey());
        });

        //* 저장 처리
        editViewStore.on('save-settings', async () => {
            setErrCode('');
            setErrMsg('');

            // 입력 값 검증
            const res = await formValidate('mod', dataRef.current);
            
            // 검증 에러
            if( res.isErr ){
                setErrCode(res.code);
                setErrMsg(res.msg);
                return;
            }

            // Todo.. 저장
            const apiRes = await api_updateItem(dataRef.current) as ApiResult;

            // 에러가 있을 경우
            if( apiRes.isErr ){
                // JSON포맷의 에러일 경우
                if( apiRes.isErrJSON ){
                    setErrCode(apiRes.msg.code);
                    setErrMsg(apiRes.msg.message);
                }
                // 일반 문자열 에러일 경우
                else {
                    setErrCode('server-error');
                    setErrMsg(apiRes.msg);
                }

                return false;
            }

            // 저장 이후 Settings에서 저장 신호 전달
            editViewStore.trigger('tab-settings-update');
        });

        // unMount
        return () => editViewStore.offs([
            'tab-settings',
            'save-settings',
        ]);
    }, []);

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        dataRef.current[key] = value;
    };

    return <>
        <FormCreateContent
            type='mod'
            row={raw}
            onSetData={onSetData}
            errMsg={errMsg}
            errCode={errCode}
            key={formKey}
        />
    </>;
}

function reRenderKey(){
    return 'settings-'+new Date().getTime();
}