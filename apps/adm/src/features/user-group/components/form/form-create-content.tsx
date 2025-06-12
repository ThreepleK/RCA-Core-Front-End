import { useEffect, useState } from "react";
import { UI_Alert, UI_Flex, UI_FormRadio, UI_FormSelect, UI_Switch, UI_TextInput } from "@/compos/ui";

import style from './form-create-content.module.css'
import dayjs from "dayjs";

/**
 * 모달창에서
 * 추가에 사용될 폼
 * @param props
 * @param props.type 
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 * @param props.errMsg 에러메시지
 * @param props.errCode 에러메시지 관련 row키 값
 */
export function FormCreateContent({type, row, onSetData, errMsg, errCode}: {
    type: 'new' | 'mod';
    row: any;
    onSetData: (value: any, key: string) => void;
    errMsg?: string;
    errCode?: string;
}){
    const [r, setRow] = useState(row);

    //* 초기 설정
    useEffect(() => {
        // 초기 데이터 전달
        for( const key in r ){
            onSetData(r[key], key);
        }
    }, []);

    //* 데이터 설정
    const onData = (value: any, key: string) => {
        // 폼 데이터 재설정
        setRow(old => {
            old[key] = value;
            return {...old};
        });

        // 변경 데이터 전달
        onSetData(value, key);
    }

    return <>
        {/* 폼 */}
        <UI_Flex vertical gap='small'>
            {/* 신규 등록 폼 */}
            <UI_TextInput
                label="Group name"
                value={r?.name}
                error={errCode === 'name' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'name')}
            />
            <UI_TextInput
                label="Description"
                value={r?.description}
                error={errCode === 'description' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'description')}
            />

            {/* 수정 */}
            {type === 'mod' && <>
                <UI_FormSelect
                    label="Status"
                    value={r?.status}
                    data={[
                        {value: 'ACTIVE', label: 'Active'},
                        {value: 'INACTIVE', label: 'Inactive'},
                    ]}
                    error={errCode === 'status' && errMsg}
                    required
                    onChange={(v) => onData(v, 'status')}
                />

                <div className={style['mod-list']}>
                    <dl>
                        <dt>Predefined</dt>
                        <dd>{r?.predefined ? 'Y' : 'N'}</dd>
                    </dl>
                </div>
            </>}
            
            {/* 수정에서 서버에러 건 */}
            {type === 'mod' && errCode === 'server-error' && errMsg &&
                <UI_Alert
                    className={style['alert']}
                    message={errMsg}
                    type='error'
                    showIcon
                />
            }
        </UI_Flex>
    </>;
}