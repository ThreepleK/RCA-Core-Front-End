import { useEffect, useState } from "react";
import { UI_Flex, UI_FormRadio, UI_FormSelect, UI_TextInput } from "@/compos/ui";

import style from './form-edit-content.module.css'
import { api_getPermission, api_getUserGroup } from "../../apis";
import dayjs from "dayjs";

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

    const [groupList, setGroupList] = useState([]);
    const [permissionList, setPermissionList] = useState([]);

    //* 초기 설정
    useEffect(() => {
        // 초기 데이터 전달
        for( const key in r ){
            onSetData(r[key], key);
        }

        // api 전달 데이터 결과 설정
        const onSubscribe = (key: string, data: any) => {
            switch(key){
                case 'userGroup': setGroupList(data); break;
                case 'permission': setPermissionList(data); break;
            }
        }

        // 폼에 필요한 데이터 요청
        formAsyncDatas(onSubscribe);
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
                value={r?.userGroups}
                data={groupList}
                loading={groupList.length === 0}
                disabled={groupList.length === 0}
                mode='multiple'
                onChange={(v) => {
                    console.log('userGroup', v)
                    onData(v, 'userGroups')
                }}
            />
            <UI_FormSelect
                label='Permission set'
                value={r?.permissionSets}
                data={permissionList}
                loading={permissionList.length === 0}
                disabled={permissionList.length === 0}
                mode='multiple'
                onChange={(v) => {
                    console.log('Permission', v)
                    onData(v, 'permissionSets')
                }}
            />

            {/* 수정 */}
            {type === 'mod' && <>
                <div className={style['mod-list']}>
                    <dl>
                        <dt>Latest login date</dt>
                        <dd>{r?.updatedTime
                            ? dayjs.utc(r?.updatedTime).format('YYYY-MM-DD HH:mm:ss')
                            : '-'
                        }</dd>
                    </dl>
                    <dl>
                        <dt>Joined date</dt>
                        <dd>{r?.createdTime
                            ? dayjs.utc(r?.createdTime).format('YYYY-MM-DD HH:mm:ss')
                            : '-'
                        }</dd>
                    </dl>
                </div>
            </>}
        </UI_Flex>
    </>;
}

/**
 * 동적으로 폼에 사용 될
 * 데이터 가져오기
 */
function formAsyncDatas(
    cb: (key: string, data: any) => void
){
    // User Group
    api_getUserGroup().then(({res}) => {
        const list = res.map(r => ({
            label: r.name,
            value: r.id,
        }));

        cb('userGroup', list);
    });

    // Permission sets
    api_getPermission().then(({res}) => {
        const list = res.map(r => ({
            label: r.name,
            value: r.id,
        }));

        cb('permission', list);
    });
}