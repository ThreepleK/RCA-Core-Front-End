import { Menu, Button, type MenuProps } from 'antd';
import { IconFolderUp, IconFolderDown, IconSearch, IconLayoutSidebarRightExpandFilled } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSideMenuAreaStore, useSideMenuStore } from '@/stores';
import { MenuDefaultOpenList, type MenuItem, type MenuItem as MenuItemType, MenuList } from './menu-list';

import style from './comm-layout.module.css'
import { useRouterStore } from '@repo/shared-state'
import { UI_Title, UI_Input, UI_Menu } from '@/compos/ui';

/**
 * 사이드 영역
 */
export function SideArea({className}: {
    className: string
}){
    const [isFoled, setIsFold] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const {currState, setState} = useSideMenuAreaStore(s => s);

    //* 메뉴 토글
    const onToggle = () => {
        setIsFold(!isFoled);
    }

    //* 메뉴 검색
    const onSearch = () => {
        setSearchKeyword(inputVal);
    }

    return (
        <div className={className}>
            {/* 제목 */}
            <UI_Title className={style.title} order={5}>
                Admin
                {currState === 'open' && <span
                    className={style['side-area-btn']}
                    onClick={() => {
                        setState('close');
                    }}
                >
                    <IconLayoutSidebarRightExpandFilled size={18}/>
                </span>}
            </UI_Title>
            {/* 검색 영역 */}
            <div className={style.search}>
                <UI_Input
                    value={inputVal}
                    onChange={(event) => setInputVal(event.currentTarget.value)}
                    onKeyUp={(e) => { if(e.keyCode === 13){ onSearch(); } }}
                    addonAfter={
                        <IconSearch size={18} onClick={onSearch} />
                    }
                />
                <Button onClick={onToggle}>
                    { isFoled
                        ? <IconFolderDown size={20} />
                        : <IconFolderUp size={20} />
                    }
                </Button>
            </div>
            {/* 메뉴 */}
            <MenuPrint
                menuList={MenuList}
                searchKeyword={searchKeyword}
                isFold={isFoled}
            />
        </div>
    );
}

/**
 * 메뉴 출력
 */
function MenuPrint({ menuList, searchKeyword, isFold }: {
    menuList: MenuItemType[];       // 메뉴 리스트
    searchKeyword: string;          // 메뉴 검색
    isFold: boolean;                // 메뉴 전체 접힘 여부
}) {
    
    // 출력할 메뉴가 없을 경우
    if( !menuList || menuList.length === 0 ){ return <></>; }

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('e', e);
    }

    return <UI_Menu
        className={style['menu-list']}
        onClick={onClick}
        defaultSelectedKeys={['/adm']}
        openKeys={isFold ? [] : MenuDefaultOpenList}
        mode="inline"
        inlineIndent={10}
        items={menuList}
        searchKeyword={searchKeyword}
        subMenuCloseDelay={0}
    />;
}