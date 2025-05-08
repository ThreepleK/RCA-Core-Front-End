import { IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react';

export interface MenuItem {
    label: string,              // 메뉴 명
    link?: string,              // 이동 주소
    icon?: any,                 // 메뉴 아이콘
    childs?: MenuItem[],        // 하위 메뉴
    isOpen?: boolean,           // 펼침 여부
};

//* 메뉴 리스트
export const MenuList: MenuItem[] = [
    {
        label: 'Team',
        icon: <IconUsersGroup size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Management', link: '/admin' },
            { label: 'Permission', link: '/admin/permission' },
        ]
    },
    {
        label: 'User',
        icon: <IconUser size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Member', link: '/admin' },
            { label: 'User group', link: '/admin/user-group' },
        ]
    },
    {
        label: 'System preferences',
        icon: <IconSettings size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Logo', link: '/admin' },
            { label: 'Favicon', link: '/admin' },
            { label: 'Sidebar menu', link: '/admin/sidebar-menu' },
            { label: 'Application menu', link: '/admin/application-menu' },
        ]
    },
];