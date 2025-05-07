import { Select, Menu } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TreeEditor, EditBox } from './tree-editor';
import { useCtxMenuStore, CtxMenuItem } from '../stores'
import { useTreeStore, TREE_LIST } from '../stores'
import { useCtxBoxStore } from '../stores'

import style from "../style.module.css";
import { IconPlus } from '@tabler/icons-react';

export function MenuEditor({ menu }: {
    menu: DB_MENU_ITEM[]
}){
    const menuEditRef = useRef<HTMLDivElement>(null);

    // 메뉴, 앱 메뉴에 필요한 형태로 변환
    const menuList = useMemo(() => dbRaw2Data(menu), [menu]);
    const appList = useMemo(() => getAppList(menuList), [menuList]);

    // 기본 선택 앱 설정
    const [selectApp, setSelectApp] = useState<string|null>(appList[0].value);

    //* App이 선택 되면 트리 메뉴 변경
    const treeData = useMemo(() => getSelected_treeList(menuList, selectApp), [selectApp]);

    const {setOpen, setPosition, setMenuList} = useCtxMenuStore(s => s);
    const {list, setTreeList} = useTreeStore(s => s);
    const {
        setOpen: setBoxOpen,
        setPosition: setBoxPosition,
        setContent: setBoxContent
    } = useCtxBoxStore(s => s);

    // 초기 설정
    useEffect(() => {
        setTreeList(treeData.list);
    }, [treeData.label]);

    //* 마우스 우클릭 이벤트
    const onMenuClick = (e: any) => {

        // 하위 이벤트 대상일 때는 건너 뜀
        if( e.target !== menuEditRef.current){ return; }
        e.preventDefault();

        // 출력 될 좌표 값 가져오기 
        const { clientX, clientY } = e;

        // 우클릭 메뉴 설정
        const menu: CtxMenuItem[] = [
            {type: 'label', label: treeData.label, value: ''},
            {type: 'item', label: 'Add submenu', value: 'root-add', icon: <IconPlus size={16} />},
        ];

        // 메뉴 설정 및 선택 이벤트 처리
        setMenuList(menu, (selected) => {
            switch( selected ){
                case 'root-add':
                    setBoxContent(<EditBox title='Add submenu' mode='add' item={{
                        id: '',
                        label: '',
                    }} isRoot={true} />);
                    setBoxPosition(clientX, clientY);
                    setBoxOpen(true);    
                break;
            }
        });

        setPosition(clientX, clientY);
        setOpen(true);
    }

    return (
        <div
            className={style['menu-editor']}
            ref={menuEditRef}
            onContextMenu={onMenuClick}
        >
            {/* 앱 선택 */}
            <Select
                size="xs"
                label="Select an Application"
                data={appList}
                value={selectApp}
                onChange={setSelectApp}
                checkIconPosition="right"
                searchable
            />

            {/* 트리 편집 */}
            <TreeEditor className={style.tree} list={list} />

            {/* 우클릭 메뉴 */}
            <CtxMenu />
            {/* 우클릭 기타 박스 */}
            <CtxBox />
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
            <Menu.Dropdown style={{ position: 'fixed', left: clientX, top: clientY }}>
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
 * 우클릭 box
 */
function CtxBox(){
    const boxRef = useRef<HTMLDivElement>(null);
    const {clientX, clientY, isOpen, content} = useCtxBoxStore(s => s);
    const {setOpen} = useCtxBoxStore(s => s);

    //* 메뉴 바깥쪽 클릭 처리
    const menuOutsideClick = (e: MouseEvent) => {
        if( boxRef.current && !boxRef.current.contains(e.target as Node) ){
            setOpen(false);
        }
    }

    //* 초기 이벤트 등록
    useEffect(() => {
        setTimeout(() => {
            if( isOpen ){
                window.addEventListener('click', menuOutsideClick);
            } else {
                window.removeEventListener('click', menuOutsideClick);
            }
        }, 100);
      
        return () => window.removeEventListener('click', menuOutsideClick);
    }, [isOpen]);


    return <div ref={boxRef} style={{
        display: (isOpen ? 'block' : 'none'),
        position: 'fixed',
        zIndex: 99999,
        left: clientX,
        top: clientY
    }}>
        <div className={style['ctx-box']}>
            {content}
        </div>
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