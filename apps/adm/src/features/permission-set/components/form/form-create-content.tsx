import { useEffect, useState } from "react";
import { UI_Flex, UI_TextInput } from "@/compos/ui";
import { PermissionTable } from "./permission-table";

import style from './form-create-content.module.css'
import dayjs from "dayjs";
import { api_getMenuData } from "../../apis";

/**
 * 모달창에서
 * 추가에 사용될 폼
 * @param props
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 * @param props.errMsg 에러메시지
 * @param props.errCode 에러메시지 관련 row키 값
 */
export function FormCreateContent({row, onSetData, errMsg, errCode}: {
    row: any;
    onSetData: (value: any, key: string) => void;
    errMsg?: string;
    errCode?: string;
}){
    const [r, setRow] = useState(row);
    const [list, setList] = useState([]);

    //* 초기 설정
    useEffect(() => {
        // 초기 데이터 전달
        for( const key in r ){
            onSetData(r[key], key);
        }

        // 메뉴 가져오기
        getMenuData(list => setList(list));
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
                label="Permission set name"
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
            <UI_TextInput
                label='Predefined'
                value={r?.predefined}
                disabled={true}
            />

            <PermissionTable title={'System admin'} datas={r?.permissionList?.systemAdmin}/>
            <PermissionTable title={'Meta'} datas={r?.permissionList?.meta}/>
        </UI_Flex>
    </>;
}

/**
 * 메뉴 데이터 가져오기
 */
async function getMenuData(cb: (list: any) => void){
    api_getMenuData().then(cb);
}