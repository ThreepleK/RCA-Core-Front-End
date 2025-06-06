import { useEffect, useMemo, useRef, useState } from "react";
import { editViewStore } from "@/features/user-group/stores";
import { FormCreateContent, formValidate } from "../../form";
import { UI_Button } from "@/compos/ui";
import { data } from "react-router";

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
        // 데이터 이벤트
        editViewStore.on('tab-settings', (row) => {
            dataRef.current = {...row};
            setRaw(row);
            setFormKey(reRenderKey());
        });

        // unMount
        return () => editViewStore.off('tab-settings');
    }, []);

    //* 데이터 설정
    const onSetData = (value: any, key: string) =>{
        dataRef.current[key] = value;
    };

    const onSave = async () => {
        setErrCode('');
        setErrMsg('');
        setFormKey(reRenderKey());

        // 입력 값 검증
        const res = await formValidate('mod', dataRef.current);
        
        // 검증 에러
        if( res.isErr ){
            setErrCode(res.code);
            setErrMsg(res.msg);
            setFormKey(reRenderKey());
            return;
        }

        // Todo.. 저장
    }

    return <>
        <FormCreateContent
            row={raw}
            onSetData={onSetData}
            errMsg={errMsg}
            errCode={errCode}
            key={formKey}
        />

        <div style={{marginTop: '10px'}}>
            <UI_Button type='primary' onClick={onSave}>Save</UI_Button>
        </div>
    </>;
}

function reRenderKey(){
    return 'settings-'+new Date().getTime();
}