import { Badge, NavLink } from '@mantine/core'
import { IconDashboard, IconHome2, IconPresentation, IconTimelineEvent } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useMainMenuStore } from '@repo/shared-state'

import style from './main-menu.module.css'

/**
 * 메인 메뉴 표기 용
 */
export const MainMenu = () => {
    const navigate = useNavigate();
    const isOpen = useMainMenuStore((state) => state.isOpen());

    return <>
        <div className={style['menu-area']}>
            {_MENU_LIST.map((item) => {
                return <NavLink
                    key={item.label}
                    label={isOpen ? item.label : ''}
                    leftSection={item.icon}
                    onClick={() => navigate(item.link)}
                />
            })}
        </div>
    </>
}

interface MenuItem {
    label: string,
    icon: any,
    link: string
};

//* 메뉴 리스트
const _MENU_LIST: MenuItem[] = [{
    label: 'Home',
    icon: <IconHome2 size={20} stroke={1.5} />,
    link: '/',
}, {
    label: 'Workspace',
    icon: <IconPresentation size={20} stroke={1.5} />,
    link: '/rca',
}, {
    label: 'Dashboard',
    icon: <IconDashboard size={20} stroke={1.5} />,
    link: '/',
}, {
    label: 'Data Pipeline',
    icon: <IconTimelineEvent size={20} stroke={1.5} />,
    link: '/',
}];