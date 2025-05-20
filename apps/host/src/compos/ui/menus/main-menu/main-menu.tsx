import { Badge, Divider, NavLink } from '@mantine/core'
import { IconCloudNetwork, IconDashboard, IconFileSearch, IconHome2, IconLink, IconPresentation, IconTimelineEvent } from '@tabler/icons-react'
import { useMainMenuStore } from '@repo/shared-state'
import { MENU_ITEM } from '../apis'

import style from './main-menu.module.css'
import { useMemo } from 'react'
import { useRouterStore } from '@repo/shared-state'

type MENU_LIST_TYPE = 'main' | 'custom';

/**
 * 메인 메뉴 표기 용
 */
export const MainMenu = ({apps, customList}: {
    apps: MENU_ITEM[],
    customList: MENU_ITEM[]
}) => {
    const { pageMove } = useRouterStore(s => s);

    // App 메뉴
    const appMenus = useMemo(() => {
        return [{
            name: 'home',
            displayName: 'Home',
            link: '/',
            isVisible: true,
            isActive: true,
        }, ...apps] as MENU_ITEM[]; // Home 메뉴 추가
    }, [apps]);


    //* 메뉴 링크
    const onLink = (type: MENU_LIST_TYPE, label: string, url: string) => {
        if( type === 'custom' ){
            window.open(url, '_blank');
        } else {
            pageMove({
                label: label,
                path: url,
                type: 'tab'
            });
        }
    }

    return <>
        {/* 메인 메뉴 */}
        <MenuList menus={appMenus} menuType='main' onClick={onLink} />

        {/* 커스텀 링크 */}
        {customList && <>
            <Divider size='xs' />
            <MenuList menus={customList} menuType='custom' onClick={onLink} />
        </>}
    </>
}

/**
 * 메뉴 리스트
 */
function MenuList({menus, menuType, onClick}: {
    menus: MENU_ITEM[];
    menuType: MENU_LIST_TYPE;
    onClick: (type: MENU_LIST_TYPE, label: string, url: string)=>void;
}){
    const isOpen = useMainMenuStore((state) => state.isOpen());

    return (
        <div className={style['menu-area']}>
            {menus
                .filter(item => item.isVisible)
                .map((item) => {
                    // 링크
                    return <NavLink
                        key={item.name}
                        label={isOpen ? item.displayName : ''}
                        title={item.displayName}
                        leftSection={menuIcon(menuType, item.name)}
                        onClick={() => onClick(menuType, item.displayName, item.url)}
                    />
                })
            }
        </div>
    )
}

/**
 * 메뉴 아이콘 가져오기
 */
function menuIcon(type: MENU_LIST_TYPE, name: string){
    if( type === 'custom' ){
        return <IconLink size={20} stroke={1.5} />;
    } else if( name in _MENU_ICONS ){
        return _MENU_ICONS[name];
    } else {
        return <IconCloudNetwork size={20} stroke={1.5} />;
    }
}

// 메뉴 아이콘
const _MENU_ICONS: {[key: string]: any} = {
    home: <IconHome2 size={20} stroke={1.5} />,
    detector: <IconFileSearch size={20} stroke={1.5} />,
    RCA: <IconPresentation size={20} stroke={1.5} />,
    dashboard: <IconDashboard size={20} stroke={1.5} />,
    pipeline: <IconTimelineEvent size={20} stroke={1.5} />,
};