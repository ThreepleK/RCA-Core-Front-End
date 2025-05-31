import { IconFolder } from '@tabler/icons-react';
import type { MenuProps } from 'antd';


export type MenuItem = Required<MenuProps>['items'][number];

//* 메뉴 리스트
export const MenuList: MenuItem[] = [
    {
        key: 'general',
        icon: <IconFolder size={16} stroke={1.5} />,
        label: 'General',
        children: [
            { label: 'Team', key: '#/adm/team' },
            { label: 'Users', key: '#/adm/users' },
            { label: 'User Group', key: '#/adm/user-group' },
            { label: 'Permission', key: '#/adm/add-member' },
        ]
    },
    {
        key: 'system_settings',
        label: 'System settings',
        icon: <IconFolder size={16} stroke={1.5} />,
        children: [
            { label: 'Branding', key: '#/adm/branding' },
            { label: 'Applications', key: '#/adm/application-menu' },
            { label: 'Sidebar menu', key: '#/adm/sidebar-menu' },
            { label: 'Menus', key: '#/adm/menus' },
            { label: 'Multi language', key: '#/adm/i18n' },
            { label: 'Global configuration', key: '#/adm/g-config' },
        ]
    },
    {
        type: 'divider',
    },
    {
        label: 'Application settings',
        key: '#/adm/app_settings',
    },
    {
        label: 'Announcement',
        key: '#/adm/announcement',
    },
    {
        label: 'Monitoring',
        key: '#/adm/monitoring',
    },
];

//* 기본으로 펼칠 메인 메뉴 키 값
export const MenuDefaultOpenList: string[] = ['general', 'system_settings'];