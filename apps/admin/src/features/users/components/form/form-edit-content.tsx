import { Group, Radio, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

import style from "./form-edit-content.module.css";

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
        <Stack>
            {/* 신규 등록 폼 */}
            {type === 'new' && 
                <TextInput
                    label="User ID"
                    value={r?.username ?? ''}
                    error={errCode === 'username' && errMsg}
                    required
                    onChange={(e) => onData(e.currentTarget.value, 'username')}
                />
            }

            {/* 신규/수정 등록 폼 */}
            <TextInput
                label="Full name"
                value={r?.fullName}
                error={errCode === 'fullName' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'fullName')}
            />
            <TextInput
                label="Email"
                value={r?.email}
                error={errCode === 'email' && errMsg}
                required
                onChange={(e) => onData(e.currentTarget.value, 'email')}
            />
            <Radio.Group
                label="Status"
                withAsterisk
                value={r?.status}
                onChange={(e) => onData(e, 'status')}
                size="sm"
            >
                <Group gap="sm">
                    <Radio className={style.radio} size="sm" value="active" label="Active" />
                    <Radio className={style.radio} size="sm" value="inactive" label="Inactive" />
                </Group>
            </Radio.Group>
        </Stack>
    </>;
}