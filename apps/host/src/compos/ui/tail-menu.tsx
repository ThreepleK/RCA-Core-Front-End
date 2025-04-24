import { UnstyledButton, Menu, Text } from '@mantine/core'
import { IconArrowBarToLeft, IconArrowBarToRight, IconBellRinging, IconBox, IconCopyright, IconHelp, IconLicense, IconLogout, IconNotification, IconSettings, IconTournament, IconUser, IconUsersGroup } from '@tabler/icons-react'
import { useMainMenuStore, useUserStore } from '@repo/shared-state'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import style from './tail-menu.module.css'

/**
 * 메인 하위 메뉴 표기 용
 */
export const TailMenu = () => {    
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

    // 접힘 펼침 버튼
    const foledBtn = isOpen
        ? <IconArrowBarToLeft size={20} stroke={1.5} />
        : <IconArrowBarToRight size={20} stroke={1.5} />
    ;

    return <>
        <div className={style['menu-area']}>

            {/* [관리자] 설정 */}
            {isAdmin && 
                <Menu position='right-end' width={200} offset={isOpen ? -30 : 0} withArrow trigger="hover" transitionProps={{transition: 'fade-right', duration: 250}}>
                    <Menu.Target>
                        <UnstyledButton className='config'>
                            <span><IconSettings size={20} stroke={1.5} /></span>
                            {isOpen ? 'Configuration' : ''}
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <DropDownItems list={_ADM_CONFIG_LIST} />
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
                    <DropDownItems list={_USER_PERSONAL_MENU} />
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

//* 메뉴 클릭
const onMenuClick = (
    navigate: NavigateFunction,     // 메뉴 이동처리 함수
    type: string|undefined          // 메뉴 타입
) => {    
    switch(type){
        case 'user-p-logout': navigate('/sign-out'); break;
        case 'label-userGroup': navigate('/admin/user-group'); break;
        case 'label-permission': navigate('/admin/permission'); break;
    }
}

/**
 * 드랍다운 메뉴 아이템 표기
 */
const DropDownItems = ({list} : {
    list: MenuItem[]        // 메뉴 아이템 리스트
}) => {
    const navigate = useNavigate();

    return <>{list.map((item) => {
        const props = item?.props ?? {};

        switch(item.type){
            // 라벨
            case 'label': {
                return <Menu.Label key={item.label} {...props}>{item.label}</Menu.Label>;
            };
            // 메뉴
            case 'menu': {
                return <Menu.Item
                    key={item.label}
                    leftSection={item.icon}
                    onClick={() => onMenuClick(navigate, item?.key)}
                    {...props}
                >{item.label}</Menu.Item>;
            };
            // 분리 선
            case 'div': {
                return <Menu.Divider key={`div-${Date.now()}-${Math.random()}`} {...props}/>;
            };
        }
    })}</>;
}

//* 메뉴 설정에 필요한 타입
interface MenuItem {
    type: string,       // 메뉴 타입, label: 메뉴 라벨, menu: 메뉴 명, div: 구분 선
    label?: string,     // 라벨
    icon?: any,         // 아이콘
    key?: string,       // 메뉴 클릭 키 갑
    props?: any,        // 관련 컴포넌트 추가 속성
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
    type: 'label', label: 'Info',
}, {
    type: 'menu',
    label: 'Help',
    key: 'info-help',
    icon: <IconHelp size={14} />,
}, {
    type: 'div',
}, {
    type: 'label',
    label: 'User',
}, {
    type: 'menu',
    label: 'Notification',
    key: 'user-p-noti',
    icon: <IconBellRinging size={14} />,
    props: {
        rightSection: <Text size="xs" c="dimmed">0</Text>
    }
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
    props: {color: 'red'}
}, ];