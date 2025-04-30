import { Select, TreeNodeData, useTree } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { TreeEditor } from './tree-editor';

import style from "../style.module.css";

export function MenuEditor({ menu }: {
    menu: DB_MENU_ITEM[]
}){   
    // 메뉴, 앱 메뉴에 필요한 형태로 변환
    const menuList = useMemo(() => dbRaw2Data(menu), [menu]);
    const appList = useMemo(() => getAppList(menuList), [menuList]);

    // 기본 선택 앱 설정
    const [selectApp, setSelectApp] = useState<string|null>(appList[0].value);

    //* App이 선택 되면 트리 메뉴 변경
    const treeList = useMemo(() => getSelected_treeList(menuList, selectApp), [selectApp]);

    return (
        <div className={style['menu-editor']}>
            <Select
                size="xs"
                label="Select an Application"
                data={appList}
                value={selectApp}
                onChange={setSelectApp}
                checkIconPosition="right"
                searchable
            />
            <TreeEditor className={style.tree} MenuList={treeList} />
        </div>
    );
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
function getSelected_treeList(menuTree: TreeNodeData[], selected: string|null){
    if( !menuTree || !selected ){ return []; }

    // Select에 필요한 요소로 전달
    return menuTree.filter(item => item.value === selected);
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
function getAppList(menuTree: TreeNodeData[]){
    if( !menuTree ){ return []; }

    // Select에 필요한 요소로 전달
    return menuTree.map(item => {
        return {
            label: String(item.label),
            value: item.value,
        };
    })
}

/**
 * DB raw → UI 메뉴 형태로
 */
function dbRaw2Data(raw: DB_MENU_ITEM[]){
    if( !raw ){ return []; }

    const loop = (items: DB_MENU_ITEM[], lv: number, pId: string|null = null) => {
        const res: TreeNodeData[] = [];

        for( const item of items ){
            // 관련 레벨이 아니거나
            if( item.level !== lv ){ continue; }
            // 부모 id와 맞지 않으면 건너 뜀
            if( pId !== null && item.parentMenuId !== pId ){ continue; }

            res.push({
                value: item.id,
                label: item.displayName,
                nodeProps: item,
                children: lv < 4 ? loop(items, lv+1, item.id) : [],
            });
        }

        return res;
    }

    return loop(raw, 1, null) as TreeNodeData[];
}

//* DB에서 넘어올 임시 데이터 포맷
export interface DB_MENU_ITEM {
    level: number;                  // 메뉴 Depth
    sortOrder: number;              // 메뉴 Depth 별 순서
    id: string;                     // 메뉴 ID
    parentMenuId: string|null,      // 부모 메뉴 ID
    name: string;                   // 메뉴 명
    displayName: string;            // 화면에 보일 메뉴명
    url: string;                    // 이동 경로
    openNewTab: boolean;            // 신규 탭 열림 여부
    isVisible: boolean;             // 메뉴 보임 여부
}