import { Menu, Button, type MenuProps } from 'antd';
import { IconFolderUp, IconFolderDown, IconSearch, IconLayoutSidebarRightExpandFilled } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
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
function MenuPrint({ menuList, searchKeyword }: {
    menuList: MenuItemType[];       // 메뉴 리스트
    searchKeyword: string;      // 메뉴 검색
}) {
    
    // 출력할 메뉴가 없을 경우
    if( !menuList || menuList.length === 0 ){ return <></>; }

    const menuData = useMemo(() => {
        const loop = (items: any[], search: string) => {
            const res = [];

            for( const item of items ){
                //* React의 불변성으로 얕은 복사 처리
                const nItem = { ...item };

                //* 서브 메뉴가 있으면
                if( 'children' in nItem ){
                    // 하위 메뉴 필터링
                    const children = loop(nItem.children as any[], search);

                    // 필필터링 된 메뉴가 있으면 추가
                    if( children.length > 0 ){
                        nItem.children = children;
                        res.push(nItem);
                    }

                    // 아래 라벨 검색 건너 뜀 (하위 메뉴가 없으면 의미 없음)
                    continue;
                }

                // 구분 선 일때는 건너 뜀
                if( nItem?.type === 'divider' ){ continue; }
                
                //* 메뉴 라벨을 검색
                if( RegExp(search, 'i').test(nItem.label) ){

                    // 검색 키워드에 태그 추가
                    const sText = nItem.label.replace(
                        RegExp('(.+)?('+search+')(.+)?', 'ig'),
                        '$1<b class="item-search">$2</b>$3'
                    );

                    // 라벨에 적용
                    nItem.label = <span dangerouslySetInnerHTML={{__html: sText}} />;

                    res.push(nItem);
                }
            }

            return res;
        }

        // 검색 키워드가 있을 경우
        return (
            searchKeyword
                ? loop(menuList, searchKeyword)
                : menuList
        ) as MenuItemType[];
    }, [searchKeyword]);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('e', e);
    }

    return <UI_Menu
        className={style['menu-list']}
        onClick={onClick}
        defaultSelectedKeys={['/adm']}
        defaultOpenKeys={MenuDefaultOpenList}
        mode="inline"
        inlineIndent={10}
        items={menuData}
    />;
}