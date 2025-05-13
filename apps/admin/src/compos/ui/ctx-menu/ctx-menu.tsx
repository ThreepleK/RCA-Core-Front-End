import { Menu } from "@mantine/core";
import { useEffect, useRef } from "react";

import { useCtxMenuStore, CtxMenuItem, MenuSelectedCallback } from './ctx-menu-store'

/**
 * 우클릭 메뉴
 */
export function CtxMenu(){
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
                {menuList.map((item, idx) => getMenuItem(idx, item, callback))}
            </Menu.Dropdown>
        </Menu>
    </div>;
}

/**
 * 메뉴 아이템 가져오기
 */
function getMenuItem(
    idx: number,                    // node 고유 id
    item: CtxMenuItem,              // 메뉴 아이템 데이터
    callback: MenuSelectedCallback  // 메뉴 선택 콜백 함수
){
    switch( item.type ){
        //* 라벨
        case 'label':
            return <Menu.Label key={idx}>{item.label}</Menu.Label>;
        //* 메뉴
        default:
            return (
                <Menu.Item
                    key={idx}
                    value={item.value}
                    onClick={() => {
                        if( !callback ){ return; }
                        callback(item.value);
                    }}
                    leftSection={item.icon ?? <></>}
                >{item.label}</Menu.Item>
            );
    }
}