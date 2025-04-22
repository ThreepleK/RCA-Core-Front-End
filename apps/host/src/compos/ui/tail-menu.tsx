import { NavLink, UnstyledButton, Menu } from '@mantine/core'
import { IconArrowBarToLeft, IconArrowBarToRight, IconBox, IconCopyright, IconLicense, IconLogout, IconNotification, IconSettings, IconTournament, IconUser, IconUsersGroup } from '@tabler/icons-react'
import { useMainMenuStore, useUserStore } from '@repo/shared-state'
import { useNavigate } from 'react-router-dom'
import style from './tail-menu.module.css'

/**
 * 메인 하위 메뉴 표기 용
 */
export const TailMenu = () => {
    const navigate = useNavigate();
    
    // 메뉴 관련
    const {menuOpen, menuClose} = useMainMenuStore((state) => state);
    const isOpen = useMainMenuStore((state) => state.isOpen());

    // 로그인 사용자 정보, 관리자 여부
    const {user} = useUserStore((state) => state);
    const isAdmin = useUserStore((state) => state.isAdmin());

    //* 접힘 펼침 처리
    const onFoldToggle = () => {
        if( isOpen ){
            menuClose();
        } else {
            menuOpen();
        }
    }

    //* 메뉴 클릭
    const onMenuClick = (type: string|undefined) => {
        switch(type){
            case 'user-p-logout': navigate('/sign-out'); break;
        }
    }

    // 접힘 펼침 버튼
    const foledBtn = isOpen
        ? <IconArrowBarToLeft size={20} stroke={1.5} />
        : <IconArrowBarToRight size={20} stroke={1.5} />
    ;

    return <>
        <div className={style['menu-area']}>

            {/* [관리자] 설정 */}
            {isAdmin && 
                <Menu position='right-end' width={200} offset={isOpen ? -30 : 0} withArrow trigger="hover"  transitionProps={{transition: 'fade-right', duration: 250}}>
                    <Menu.Target>
                        <UnstyledButton className='config'>
                            <span><IconSettings size={20} stroke={1.5} /></span>
                            {isOpen ? 'Configuration' : ''}
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {_ADM_CONFIG_LIST.map((item) => {
                            switch(item.type){
                                case 'label': {
                                    return <Menu.Label>{item.label}</Menu.Label>;
                                };
                                case 'menu': {
                                    return <Menu.Item leftSection={item.icon} onClick={() => onMenuClick(item?.key)}>{item.label}</Menu.Item>;
                                };
                                case 'div': {
                                    return <Menu.Divider />;
                                };
                            }
                        })}
                    </Menu.Dropdown>
                </Menu>
            }

            {/* 사용자 정보 */}
            <Menu position='right-end' width={200} offset={isOpen ? -30 : 0} withArrow trigger="hover" transitionProps={{transition: 'fade-right', duration: 250}}>
                <Menu.Target>
                    <UnstyledButton className='user-info'>
                        <span>{user?.fullName.substring(0, 1)}</span>
                        {isOpen ? user?.fullName : ''}
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    {_USER_PERSONAL_MENU.map((item) => {
                        switch(item.type){
                            case 'label': {
                                return <Menu.Label>{item.label}</Menu.Label>;
                            };
                            case 'menu': {
                                return <Menu.Item leftSection={item.icon} onClick={() => onMenuClick(item?.key)}>{item.label}</Menu.Item>;
                            };
                            case 'div': {
                                return <Menu.Divider />;
                            };
                        }
                    })}
                </Menu.Dropdown>
            </Menu>

            {/* Copyright & Folded */}
            <UnstyledButton className='copyright' onClick={onFoldToggle}>
                <span>{isOpen
                    ? <><IconCopyright size={14} stroke={1.5}/> 2025 Bistelligence, inc.</>
                    : <></>
                }</span>
                {foledBtn}
            </UnstyledButton>
        </div>
    </>
}

interface MenuItem {
    type: string,
    label?: string,
    icon?: any,
    key?: string
};

//* 관리자 메뉴
const _ADM_CONFIG_LIST: MenuItem[] = [{
    type: 'label',
    label: 'User',
}, {
    type: 'menu',
    label: 'User Group',
    key: 'label-userGroup',
    icon: <IconUsersGroup size={14} />,
}, {
    type: 'menu',
    label: 'Permission',
    key: 'label-permission',
    icon: <IconLicense size={14} />,
}, {
    type: 'div',
}, {
    type: 'label', label: 'Team',
}, {
    type: 'menu',
    label: 'Menu',
    key: 'team-menu',
    icon: <IconTournament size={14} />,
}, {
    type: 'menu',
    label: 'Application',
    key: 'team-application',
    icon: <IconBox size={14} />,
}, {
    type: 'menu',
    label: 'Notification',
    key: 'team-notification',
    icon: <IconNotification size={14} />,
}, ];

//* 사용자 메뉴
const _USER_PERSONAL_MENU: MenuItem[] = [{
    type: 'label',
    label: 'User',
}, {
    type: 'menu',
    label: 'Profile',
    key: 'user-p-profile',
    icon: <IconUser size={14} />,
}, {
    type: 'menu',
    label: 'Logout',
    key: 'user-p-logout',
    icon: <IconLogout size={14} />,
}, ];