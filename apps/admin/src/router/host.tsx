import { lazy, ReactNode } from 'react';
import type { RouteObject } from 'react-router';
import { KeepAliveRouter } from '@repo/core-ui';
import Layout from '@/compos/layout/comm-layout'

//* 라우터 내역
import Main from '@/features/main'
import Teams from '@/features/teams'
import Team from '@/features/team'
import Users from '@/features/users'
import UserGroup from '@/features/user-group'
import Permission from '@/features/permission'
import Branding from '@/features/branding'
import SidebarMenu from '@/features/sidebar-menu'
import ApplicationMenu from '@/features/application-menu'
import AddMember from '@/features/add-member'


function wrapLayout(elem: ReactNode, path: string){
    return (
        <KeepAliveRouter cacheKey={`admin/${path}`}>
            <Layout>{elem}</Layout>
        </KeepAliveRouter>
    )
}

export default {
    path: 'admin',
    children: [
        { path: '', element: wrapLayout(<Main />, '') },
        { path: 'team', element: wrapLayout(<Team />, 'team') },
        { path: 'users', element: wrapLayout(<Users />, 'users') },
        { path: 'user-group', element: wrapLayout(<UserGroup />, 'user-group') },
        { path: 'permission', element: wrapLayout(<Permission />, 'permission') },
        { path: 'branding', element: wrapLayout(<Branding />, 'branding') },
        { path: 'application-menu', element: wrapLayout(<ApplicationMenu />, 'application-menu') },
        { path: 'sidebar-menu', element: wrapLayout(<SidebarMenu />, 'sidebar-menu') },
        { path: 'add-member', element: wrapLayout(<AddMember />, 'add-member') },
    ]
} as RouteObject;