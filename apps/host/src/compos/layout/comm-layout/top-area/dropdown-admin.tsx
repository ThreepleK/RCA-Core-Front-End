import { Menu, UnstyledButton } from "@mantine/core"
import { useUserStore } from "@repo/shared-state"
import { IconBox, IconDeviceDesktop, IconLicense, IconNotification, IconTournament, IconUsersGroup } from "@tabler/icons-react"

import { MenuItem, DropdownItems } from './'
import style from '../comm-layout.module.css'
import { useState } from "react"

/**
 * [Dropdown] 관리자
 */
export function DropdownAdmin(){
    const [opened, setOpened] = useState(false);

    // 사용자 관리자 여부
    const isAdmin = useUserStore((state) => state.isAdmin());

    return (isAdmin &&
        <Menu opened={opened} onChange={setOpened} position='bottom' width={200} offset={-4} withArrow transitionProps={{transition: 'fade', duration: 100}}>
            <Menu.Target>
                <UnstyledButton
                    className={`${style['dropdown-btn']} ${opened ? 'on-active' : ''}`}
                    title='admin'
                >
                    <span><IconDeviceDesktop size={18} strokeWidth={1.75} color={'white'} /></span>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <DropdownItems list={_USER_PERSONAL_MENU} />
            </Menu.Dropdown>
        </Menu>
    )
}

//* 사용자 메뉴
const _USER_PERSONAL_MENU: MenuItem[] = [
    { type: 'label',    label: 'User' },
    { type: 'menu',     label: 'User Group',    key: 'label-userGroup',     icon: <IconUsersGroup size={14} /> },
    { type: 'menu',     label: 'Permission',    key: 'label-permission',    icon: <IconLicense size={14} /> },
    { type: 'div' },
    { type: 'label',    label: 'Team' },
    { type: 'menu',     label: 'Menu',          key: 'team-menu',           icon: <IconTournament size={14} /> },
    { type: 'menu',     label: 'Application',   key: 'team-application',    icon: <IconBox size={14} /> },
    { type: 'menu',     label: 'Notification',  key: 'team-notification',   icon: <IconNotification size={14} /> },
];