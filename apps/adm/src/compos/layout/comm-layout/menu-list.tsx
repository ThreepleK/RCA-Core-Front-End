import { IconFolder, IconSettings, IconUser, IconUsersGroup } from '@tabler/icons-react';

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
        label: 'General',
        // icon: <IconUsersGroup size={16} stroke={1.5} />,
        icon: <IconFolder size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Team', link: '/admin/team' },
            { label: 'Users', link: '/admin/users' },
            { label: 'User Group', link: '/admin/user-group' },
            { label: 'Permission', link: '/admin/add-member' },
        ]
    },
    // {
    //     label: 'System settings',
    //     icon: <IconUser size={16} stroke={1.5} />,
    //     isOpen: true,
    //     childs: [
    //         { label: 'Member', link: '/admin' },
    //         { label: 'User group', link: '/admin/user-group' },
    //     ]
    // },
    {
        label: 'System settings',
        // icon: <IconSettings size={16} stroke={1.5} />,
        icon: <IconFolder size={16} stroke={1.5} />,
        isOpen: true,
        childs: [
            { label: 'Branding', link: '/admin/branding' },
            { label: 'Applications', link: '/admin/application-menu' },
            { label: 'Sidebar menu', link: '/admin/sidebar-menu' },
            { label: 'Menus', link: '/admin' },
            { label: 'Multi language', link: '/admin' },
            { label: 'Global configuration', link: '/admin' },
        ]
    },
    {
        label: 'Application settings',
        link: '/admin',
    },
    {
        label: 'Announcement',
        link: '/admin',
    },
    {
        label: 'Monitoring',
        link: '/admin',
    },
];