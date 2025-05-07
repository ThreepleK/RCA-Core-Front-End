import { Select, Menu } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TreeEditor, TREE_LIST } from './tree-editor';
import { useCtxMenuStore } from '../stores'

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
    const treeData = useMemo(() => getSelected_treeList(menuList, selectApp), [selectApp]);

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
            <TreeEditor
                className={style.tree}
                selectedLabel={treeData.label}
                menuList={treeData.list}
            />

            {/* 우클릭 메뉴 */}
            <CtxMenu />
        </div>
    );
}

/**
 * 우클릭 메뉴
 */
function CtxMenu(){
    const menuRef = useRef<HTMLDivElement>(null);

    // 우클릭 메뉴 관련 store 가져오기
    const {clientX, clientY, isOpen, menuList} = useCtxMenuStore(s => s);
    const {setOpen, callback} = useCtxMenuStore(s => s);

    //* 메뉴 바깥쪽 클릭 처리
    const menuOutsideClick = (e: MouseEvent) => {
        if( menuRef.current && !menuRef.current.contains(e.target as Node) ){
            setOpen(false);
        }
    }

    //* 초기 이벤트 등록
    useEffect(() => {
        if( isOpen ){
            window.addEventListener('click', menuOutsideClick);
        } else {
            window.removeEventListener('click', menuOutsideClick);
        }
      
        return () => window.removeEventListener('click', menuOutsideClick);
    }, [isOpen]);

    return <div ref={menuRef}>
        <Menu opened={isOpen}>
            <Menu.Dropdown style={{
                position: 'fixed',
                left: clientX,
                top: clientY,
            }}>
                {menuList && menuList.map((item, idx) => {
                    if( item.type === 'label' ){
                        return <Menu.Label key={idx}>{item.label}</Menu.Label>
                    } else {
                        return <Menu.Item
                            key={idx}
                            value={item.value}
                            onClick={() => {
                                if( !callback ){ return; }
                                callback(item.value);
                            }}
                            leftSection={item.icon ?? <></>}
                        >{item.label}</Menu.Item>
                    }    
                })}
            </Menu.Dropdown>
        </Menu>
    </div>;
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
function getSelected_treeList(menuTree: TREE_LIST, selected: string|null): {
    label: string;
    list: TREE_LIST;
}{
    // 트리 데이터 or 선택 된 항목이 없을 경우
    if( !menuTree || !selected ){ return { label: '', list: []}; }

    // Select된 리스트만 가져오기
    const treeList = menuTree.filter(item => item.id === selected);

    // 선택된 최상위 라벨과, 하위 내역 가져오기
    const {label, children} = treeList[0];

    // 결과 값 전달
    return { label, list: children ?? []};
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
function getAppList(menuTree: TREE_LIST){
    if( !menuTree ){ return []; }

    // Select에 필요한 요소로 전달
    return menuTree.map(item => {
        return {
            label: String(item.label),
            value: String(item.id),
        };
    })
}

/**
 * DB raw → UI 메뉴 형태로
 */
function dbRaw2Data(raw: DB_MENU_ITEM[]){
    if( !raw ){ return []; }

    const loop = (items: DB_MENU_ITEM[], lv: number, pId: string|null = null) => {
        const res: TREE_LIST = [];

        for( const item of items ){
            // 관련 레벨이 아니면 건너 뜀
            if( item.level !== lv ){ continue; }
            // 부모 id와 맞지 않으면 건너 뜀
            if( pId !== null && item.parentMenuId !== pId ){ continue; }

            res.push({
                id: item.id,
                label: item.displayName,
                nodeProps: item,
                children: lv < 4 ? loop(items, lv+1, item.id) : [],
            });
        }

        return res;
    }

    return loop(raw, 1, null);
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