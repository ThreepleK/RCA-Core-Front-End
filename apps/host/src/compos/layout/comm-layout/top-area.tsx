import { UnstyledButton, Menu, Text } from '@mantine/core'
import { IconBellRinging, IconCaretDownFilled, IconHelp, IconLogout, IconUser } from '@tabler/icons-react'

import { useRouterStore, useUserStore, RouterState } from '@repo/shared-state'

import { Logo } from '@/compos/ui/logo';
import style from './comm-layout.module.css'

export function TopArea(){
    // 로그인 사용자 정보, 관리자 여부
    const {user} = useUserStore((state) => state);

    return (
        <div className={style['cl-top']}>
            <div>
                <Logo />
            </div>
            <div>
                {/* 사용자 정보 */}
                <Menu position='bottom' width={200} offset={-7} withArrow transitionProps={{transition: 'fade-down', duration: 250}}>
                    <Menu.Target>
                        <UnstyledButton className={style['user-info']}>
                            <span>
                                {user?.fullName.substring(0, 1)}
                                <IconCaretDownFilled size={10} color={'gray'} />
                            </span>
                        </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <DropDownItems list={_USER_PERSONAL_MENU} />
                    </Menu.Dropdown>
                </Menu>
            </div>
        </div>
    )
}

/**
 * 드랍다운 메뉴 아이템 표기
 */
const DropDownItems = ({list} : {
    list: MenuItem[]        // 메뉴 아이템 리스트
}) => {
    const { pageMove } = useRouterStore(s => s);

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
                    onClick={() => onMenuClick(pageMove, item?.key)}
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

//* 메뉴 클릭
const onMenuClick = (
    pageMove: RouterState['pageMove'],     // 메뉴 이동처리 함수
    type: string|undefined          // 메뉴 타입
) => {    
    switch(type){
        case 'user-p-logout': pageMove({
            label: 'Sign out',
            path: '/sign-out',
            type: 'move'
        }); break;
        case 'label-userGroup': pageMove({
            label: 'User Group',
            path: '/admin/user-group',
            type: 'tab'
        }); break;
        case 'label-permission': pageMove({
            label: 'Permission',
            path: '/admin/permission',
            type: 'tab'
        }); break;
    }
}

//* 메뉴 설정에 필요한 타입
interface MenuItem {
    type: string,       // 메뉴 타입, label: 메뉴 라벨, menu: 메뉴 명, div: 구분 선
    label?: string,     // 라벨
    icon?: any,         // 아이콘
    key?: string,       // 메뉴 클릭 키 갑
    props?: any,        // 관련 컴포넌트 추가 속성
};

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