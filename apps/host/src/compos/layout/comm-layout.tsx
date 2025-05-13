import { AppShell } from '@mantine/core';
import { useMainMenuStore } from '@repo/shared-state'
import { KeepAliveRouter } from '@repo/core-ui'

import AppSidebar from "./app-sidebar";
import { MainMenu, TailMenu, api_getMenuData, MENU_DATAS } from "../ui/menus";
import { useEffect, useState } from 'react';

export default function() {
    const isOpen = useMainMenuStore((state) => state.isOpen());
    const isHide = useMainMenuStore((state) => state.isHide());
    const [menus, setMenus] = useState<MENU_DATAS|null>(null);

    useEffect(() => {
        api_getMenuData().then(({isErr, res}) => {
            if( isErr ){ return; }
            setMenus(res);
        });
    }, []);

    return (
        <AppShell
            navbar={{
                width: isHide ? 0 : (isOpen ? 250 : 50),
                breakpoint: 'sm',
            }}
            padding="0"
            transitionDuration={0}
        >
            {!isHide && 
                <AppShell.Navbar className="flex gap-y-3 relative">
                    <AppSidebar />
                    <MainMenu
                        apps={menus?.app_hub ?? []}
                        customList={menus?.custom_links ?? []}
                    />
                    <TailMenu />
                </AppShell.Navbar>
            }
            <AppShell.Main>
                {/* 라우터 본문 출력 */}
                <KeepAliveRouter />
            </AppShell.Main>
        </AppShell>
    )
}