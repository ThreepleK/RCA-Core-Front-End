import { useEffect, useState } from 'react';
import { useMainMenuStore } from '@repo/shared-state'
import { KeepAliveRouter } from '@repo/core-ui'

import { AppSidebar } from "./";
import { MainMenu, TailMenu, api_getMenuData, MENU_DATAS } from "@/compos/ui/menus";

import style from './comm-layout.module.css'
import { TopArea } from './top-area';
import { BottomArea } from './bottom-area';

export function CommLayout() {
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
        <div className={style['comm-layout']} style={{
            '--cl-side-w': isHide ? 0 : (isOpen ? '250px' : '50px')
        } as any}>
            {/* 상단 */}
            <TopArea />

            {/* 사이드 */}
            {!isHide && 
                <div className={style['cl-side']}>
                    <AppSidebar />
                    <MainMenu
                        apps={menus?.app_hub ?? []}
                        customList={menus?.custom_links ?? []}
                    />
                    <TailMenu />
                </div>
            }

            {/* 본문 */}
            <div className={style['cl-conts']}>
                {/* 라우터 본문 출력 */}
                <KeepAliveRouter isHost={true} />
            </div>

            {/* 하단 */}
            <BottomArea />
        </div>
    )
}