import { AppShell } from '@mantine/core';
import { useMainMenuStore } from '@repo/shared-state'
import { KeepAliveRouter } from '@repo/core-ui'

import AppSidebar from "./app-sidebar";
import { MainMenu } from "../ui/main-menu";
import { TailMenu } from "../ui/tail-menu";

export default function() {
    const isOpen = useMainMenuStore((state) => state.isOpen());
    const isHide = useMainMenuStore((state) => state.isHide());

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
                    <MainMenu />
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