import { useMainMenuStore } from '@repo/shared-state'
import { type ReactNode, useEffect } from 'react'
import { SideArea } from './side-area'

import style from './comm-layout.module.css'
import { useSideMenuAreaStore } from '@/stores'

/**
 * App 기본 레이아웃
 */
export function CommLayout({children}: {
    children: ReactNode
}) {
    const isOpen = useMainMenuStore((state) => state.isOpen());
    const menuClose = useMainMenuStore((state) => state.menuClose);

    const currState = useSideMenuAreaStore(s => s.currState);

    useEffect(() => {
        if( isOpen ){ menuClose(); }
    }, [])

    return (
        <div
            className={style.layout}
            style={{'--side-width': (currState === 'close' ? '0px' : '250px')} as any}
        >
            {/* 좌측 사이드 */}
            <SideArea className={`${style['side-area']} ${currState === 'close' && 'area-close'}`} />
            
            {/* 라우터 본문 출력 */}
            <div className={style['cont-area']}>
                {children}
            </div>
        </div>
    )
}