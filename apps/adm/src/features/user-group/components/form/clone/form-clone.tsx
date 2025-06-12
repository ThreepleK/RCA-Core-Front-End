import { UI_Flex, UI_TextInput } from "@/compos/ui";
import { useEffect, useState } from "react";

/**
 * 복제
 */
export function FormClone({row, onSetData, errMsg, errCode}: {
    row: any;
    onSetData: (value: any, key: string) => void;
    errMsg?: string;
    errCode?: string;
}) {
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
        </UI_Flex>
    </>;
}