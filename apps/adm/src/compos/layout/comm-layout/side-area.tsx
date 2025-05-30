import { Menu, Input, Button, type MenuProps } from 'antd';
import { IconFolderUp, IconFolderDown, IconSearch, IconLayoutSidebarRightExpandFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSideMenuAreaStore, useSideMenuStore } from '@/stores';
import { type MenuItem as MenuItemType, MenuList } from './menu-list';

import style from './comm-layout.module.css'
import { useRouterStore } from '@repo/shared-state'
import { Title } from '@/compos/ui';

/**
 * 사이드 영역
 */
export function SideArea({className}: {
    className: string
}){
    const isFoled = useSideMenuStore((s: any) => s.isFolded());
    const {setAllFold, setAllUnFold, setMenuTotalCnt} = useSideMenuStore((s: any) => s);
    const [inputVal, setInputVal] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const {currState, setState} = useSideMenuAreaStore(s => s);

    //* 초기 설정
    useEffect(() => {
        // 최상단 메뉴 총 갯수 설정
        setMenuTotalCnt(MenuList.length);
    }, []);

    //* 메뉴 토글
    const onToggle = () => {
        if( isFoled ){
            setAllUnFold()
        } else {
            setAllFold();
        }
    }

    //* 메뉴 검색
    const onSearch = () => {
        setSearchKeyword(inputVal);
    }

    return (
        <div className={className}>
            {/* 제목 */}
            <Title className={style.title} order={5}>
                Admin
                {currState === 'open' && <span
                    className={style['side-area-btn']}
                    onClick={() => {
                        setState('close');
                    }}
                >
                    <IconLayoutSidebarRightExpandFilled size={18}/>
                </span>}
            </Title>
            {/* 검색 영역 */}
            <div className={style.search}>
                <Input
                    value={inputVal}
                    onChange={(event) => setInputVal(event.currentTarget.value)}
                    onKeyUp={(e) => { if(e.keyCode === 13){ onSearch(); } }}
                    addonAfter={
                        <IconSearch size={20} onClick={onSearch} />
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
            <MenuPrint menuList={MenuList} searchKeyword={searchKeyword} />
        </div>
    );
}

/**
 * 메뉴 출력
 */
function MenuPrint({ menuList }: {
    menuList: MenuItemType[];       // 메뉴 리스트
    searchKeyword: string;      // 메뉴 검색
}) {
    
    // 출력할 메뉴가 없을 경우
    if( !menuList || menuList.length === 0 ){ return <></>; }

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('e', e);
    }

    return <Menu
        className={style['menu-list']}
        onClick={onClick}
        style={{ width: '100%' }}
        defaultSelectedKeys={['/adm']}
        // defaultOpenKeys={['']}
        mode="inline"
        items={menuList}
    />
}