import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { UI_Flex, UI_FormRadio, UI_FormSelect, UI_TextInput } from "@/compos/ui";
import { createSendAction } from "@/stores/send-event";

import style from './form-edit-content.module.css'

const useAsyncData = createSendAction<any>();

/**
 * 모달창에서
 * 추가/수정에 사용될 폼
 * @param props
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 * @param props.errMsg 에러메시지
 * @param props.errCode 에러메시지 관련 row키 값
 */
export function FormEditContent({row, onSetData, errMsg, errCode}: {
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
        ---
    </>;
}