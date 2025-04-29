import { useMainMenuStore } from '@repo/shared-state'
import { KeepAliveRouter } from '@repo/core-ui'
import { useEffect } from 'react'
import { SideArea } from './side-area'

import style from './comm-layout.module.css'

export default function() {
    const isOpen = useMainMenuStore((state) => state.isOpen());
    const menuClose = useMainMenuStore((state) => state.menuClose);

    useEffect(() => {
        if( isOpen ){ menuClose(); }
    }, [])

    return (
        <div className={style.layout} style={{'--side-width': '250px'} as any}>
            {/* 좌측 사이드 */}
            <SideArea className={style['side-area']} />
            
            {/* 라우터 본문 출력 */}
            <div className={style['cont-area']}>
                <KeepAliveRouter />
            </div>
        </div>
    )
}