import { Menu, Text, UnstyledButton } from "@mantine/core";
import { useUserStore } from "@repo/shared-state";
import { IconBellRinging, IconCaretDownFilled, IconCaretUpFilled, IconHelp, IconLogout, IconUser } from "@tabler/icons-react";

import { MenuItem, DropdownItems } from './'
import style from '../comm-layout.module.css'
import { useState } from "react";

/**
 * [Dropdown] 사용자
 */
export function DropdownUser(){
    const [opened, setOpened] = useState(false);
    // 로그인 사용자 정보
    const { user } = useUserStore((state) => state);

    return (
        <Menu opened={opened} onChange={setOpened} position='bottom' width={200} offset={-4} withArrow transitionProps={{transition: 'fade', duration: 100}}>
            <Menu.Target>
                <UnstyledButton className={`${style['user-info']} ${opened ? 'on-active' : ''}`}>
                    <span>
                        {user?.fullName.substring(0, 1)}
                        {opened
                            ? <IconCaretUpFilled size={10} color='white' />
                            : <IconCaretDownFilled size={10} color='gray' />
                        }
                    </span>
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
    { type: 'label',    label: 'Info' },
    { type: 'menu',     label: 'Help',          key: 'info-help',      icon: <IconHelp size={14} /> },
    { type: 'div' },
    { type: 'label',    label: 'User' },
    { type: 'menu',     label: 'Notification',  key: 'user-p-noti',     icon: <IconBellRinging size={14} />,
        props: {
            rightSection: <Text size="xs" c="dimmed">0</Text>
        }
    },
    { type: 'menu',     label: 'Profile',       key: 'user-p-profile',  icon: <IconUser size={14} /> },
    { type: 'menu',     label: 'Logout',        key: 'user-p-logout',   icon: <IconLogout size={14} />,
        props: {
            color: 'red'
        }
    },
];