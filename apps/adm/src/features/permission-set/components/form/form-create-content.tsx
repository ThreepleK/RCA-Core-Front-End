import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { UI_Flex, UI_TextInput } from "@/compos/ui";
import { PermissionTable } from "./permission-table";
import { api_getMenuData } from "../../apis";

import style from './form-create-content.module.css'

type PermissionData = {         //* row에서 넘어오는 데이터 권한 타입
    id: string;                 // 해당 메뉴 id
    readable: boolean;          // 읽기 권한 여부
    creatable: boolean;         // 쓰기 권한 여부
    deletable: boolean;         // 삭제 권한 여부
    updatable: boolean;         // 수정 권한 여부
};

export type PermissionTableItem = {    //* 퍼미션 Table에서 사용될 데이터 타입
    item: string;               // 아이템 이름 (메뉴 이름)
    isDisable?: boolean;        // 수정 못하는 영역
} & PermissionData;

/**
 * 모달창에서
 * 추가에 사용될 폼
 * @param props
 * @param props.type 폼 타입
 * @param props.row 폼에 전달할 그리드 row 데이터
 * @param props.onSetData 한 항목당 변경할 데이터
 * @param props.errMsg 에러메시지
 * @param props.errCode 에러메시지 관련 row키 값
 */
export function FormCreateContent({type, row, onSetData, errMsg, errCode}: {
    type: 'new'|'mod';
    row: any;
    onSetData: (value: any, key: string) => void;
    errMsg?: string;
    errCode?: string;
}){
    const [r, setRow] = useState(row);
    const [list, setList] = useState<ReactNode>(null);

    //* 초기 설정
    useEffect(() => {
        // 초기 데이터 전달
        for( const key in r ){
            onSetData(r[key], key);
        }

        // 폼 내에서 변경된 권한 데이터 내역
        const onUpdatePermissions = (pList: PermissionTableItem[]) => {
            onData(pList, 'permissionEditList');
        }

        // 메뉴 가져오기
        getMenuData(
            r.permissions as PermissionData[],
            list => setList(list),
            onUpdatePermissions
        );
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
            {/* 신규, 수정 폼 */}
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
                value={r?.predefined === true ? 'Y' : 'N'}
                disabled={true}
            />

            {list}
        </UI_Flex>
    </>;
}

/**
 * 메뉴 데이터 가져오기
 * @param permissions 원래 권한 데이터
 * @param tableComponentCB 폼에서 사용될 컴포넌트 콜백 함수
 * @param onUpdate 편집된 
 */
async function getMenuData(
    permissions: PermissionData[],
    tableComponentCB: (list: any) => void,
    onUpdate: (row: PermissionTableItem[]) => void
){
    // Application 메뉴 데이터 가져오기
    const menus = await api_getMenuData();

    // 배열 형태의 권한 데이터를 key, value 형태로 변환 (쉽게 데이터 참조하기 위함)
    const pList = permissions.reduce((acc, item: any) => {
        acc[item.menuId] = item;
        return acc;
    }, {});

    const pTables = menus.map((r, rIdx) => {
        // 부 메뉴 데이터 설정 (PermissionTable에 사용 될 데이터)
        const subMenus = r.children.map(c => {

            // 관련 부메뉴 권한 row 가져오기
            const target = pList[c.id] ?? {};

            return {
                id: c.id,
                item: c.displayName,
                readable: target['readable'] ?? false,
                creatable: target['creatable'] ?? false,
                deletable: target['deletable'] ?? false,
                updatable: target['updatable'] ?? false,
            } as PermissionTableItem;
        });

        const datas = [
            // 메인 메뉴
            {
                id: r.id,
                item: r.displayName,
                readable: true,
                creatable: true,
                deletable: true,
                updatable: true,
                isDisable: true,
            },
            // 부메뉴
            ...subMenus
        ];

        // 테이블 컴포넌트 설정
        return <PermissionTable
            title={r.displayName}
            datas={datas}
            onUpdate={onUpdate}
            key={rIdx}
        />
    })

    tableComponentCB(pTables);
}