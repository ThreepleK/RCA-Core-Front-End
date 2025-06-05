import { useEffect, useState } from "react";
import { UI_Flex, UI_FormRadio, UI_FormSelect, UI_TextInput } from "@/compos/ui";

import style from './form-edit-content.module.css'

/**
 * 모달창에서
 * 추가/수정에 사용될 폼
 * @param props
 * @param props.type 폼 타입 (new: 신규, mod: 수정)
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 * @param props.errMsg 에러메시지
 * @param props.errCode 에러메시지 관련 row키 값
 */
export function FormEditContent({type, row, onSetData, errMsg, errCode}: {
    type: 'new' | 'mod'
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
            {type === 'new' ? <>
                <UI_TextInput
                    label="User ID"
                    value={r?.username ?? ''}
                    error={errCode === 'username' && errMsg}
                    required
                    onChange={(e) => onData(e.currentTarget.value, 'username')}
                />
            </> : <>
                <div className={style['mod-list']}>
                    <dl>
                        <dt>User ID</dt>
                        <dd>{r?.username}</dd>
                    </dl>
                </div>
            </>}

            {/* 신규/수정 등록 폼 */}
            <UI_TextInput
                label="Full name"
                value={r?.fullName}
                error={errCode === 'fullName' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'fullName')}
            />
            <UI_TextInput
                label="Email"
                value={r?.email}
                error={errCode === 'email' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'email')}
            />
            <UI_FormRadio
                label="Status"
                required
                value={r?.status}
                onChange={(e) => onData(e.nativeEvent.target.value, 'status')}
                data={[
                    {value: 'active', label: 'Active'},
                    {value: 'inactive', label: 'Inactive'},
                ]}
            />
            <UI_FormSelect
                label='User group'
                value={r?.userGroup}
                data={_GROUP_LIST}
                mode='multiple'
                onChange={(v) => onData(v, 'userGroup')}
            />
            <UI_FormSelect
                label='Permission set'
                value={r?.permission}
                data={_PERMISSION_LIST}
                mode='multiple'
                onChange={(v) => onData(v, 'permission')}
            />

            {/* 수정 */}
            {type === 'mod' && <>
                <div className={style['mod-list']}>
                    <dl>
                        <dt>Latest login date</dt>
                        <dd>{r?.latestLoginDate}</dd>
                    </dl>
                    <dl>
                        <dt>Joined date</dt>
                        <dd>{r?.createdTime}</dd>
                    </dl>
                </div>
            </>}
        </UI_Flex>
    </>;
}

const _GROUP_LIST = [
    { label: 'Group 01',  value: 'group 01' },
    { label: 'Group 02',  value: 'group 02' },
];

const _PERMISSION_LIST = [
    { label: 'Permission 01',  value: 'permission 01' },
    { label: 'Permission 02',  value: 'permission 02' },
];