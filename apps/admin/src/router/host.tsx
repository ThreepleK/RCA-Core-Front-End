import { lazy, ReactNode } from 'react';
import type { RouteObject } from 'react-router';
import { KeepAliveRouter } from '@repo/core-ui';
import Layout from '@/compos/layout/comm-layout'

//* 라우터 내역
import Main from '@/features/main'
import Teams from '@/features/teams'
import UserGroup from '@/features/user-group'
import Permission from '@/features/permission'
import Branding from '@/features/branding'
import SidebarMenu from '@/features/sidebar-menu'
import ApplicationMenu from '@/features/application-menu'


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
        { path: 'teams', element: wrapLayout(<Teams />, 'teams') },
        { path: 'user-group', element: wrapLayout(<UserGroup />, 'user-group') },
        { path: 'permission', element: wrapLayout(<Permission />, 'permission') },
        { path: 'branding', element: wrapLayout(<Branding />, 'branding') },
        { path: 'application-menu', element: wrapLayout(<ApplicationMenu />, 'application-menu') },
        { path: 'sidebar-menu', element: wrapLayout(<SidebarMenu />, 'sidebar-menu') },
    ]
} as RouteObject;