import { FC, ReactNode, useMemo } from 'react';
import { Title } from "@mantine/core";
import { useSideMenuAreaStore } from '@/stores';
import { IconLayoutSidebarLeftExpandFilled } from '@tabler/icons-react';

import style from './contents-layout.module.css'
import { ContsLayoutProvider, useContsLayoutStore } from './contents-layout-store-ctx';
import { useStore } from 'zustand';

/**
 * 본문 레이아웃
 */
export function ContentsLayout({ children, CtxProvider }: {
    children?: ReactNode;
    CtxProvider?: FC<{ children: ReactNode }>;
}) {

    // 보여줄 화면
    return <>
        <ContsLayoutProvider>
            {CtxProvider ? (
                <CtxProvider>
                    <Layout>{children}</Layout>
                </CtxProvider>
            ) : (
                <Layout>{children}</Layout>
            )}
        </ContsLayoutProvider>
    </>;
}

/**
 * 레이아웃
 */
function Layout({ children }: {
    children?: ReactNode
}){
    const stateStore = useContsLayoutStore();

    //-- 메인 사이드 메뉴
    const mainSideState = useSideMenuAreaStore(s => s.currState);   // 메인 사이드 영역 상태
    const setMainSideState = useSideMenuAreaStore(s => s.setState); // 메인 사이드 영역 상태 설정

    //-- 컨텐츠 영역
    const titleLeft = useStore(stateStore, s => s.titleLeft);       // 타이틀 좌측
    const titleRight = useStore(stateStore, s => s.titleRight);     // 타이틀 우츨
    const sideArea = useStore(stateStore, s => s.sideArea);         // 컨텐츠 사이드 영역
    const sideWidth = useStore(stateStore, s => s.sideWidth);       // 컨텐츠 사이드 영역 넓이

    //-- 컨텐츠 사이드 영역 보임 여부
    const isShowSide = useMemo(() => (sideWidth ? true : false), [sideWidth]);

    return <>
        {/* 컨텐츠 */}
        <section className={style.section} style={{
            '--cs-width': isShowSide ? sideWidth : '0px'
        } as any}>
            {/* 상단 타이틀 */}
            <div
                className={style['title-area']}
                style={{
                    // 사이드 영역이 생기면 좌/우 → 사이드 영역/나머지 크기 (그 외 반반)
                    '--ta-template': isShowSide ? `${sideWidth} 1fr`: '1fr 1fr',
                    '--ta-right': isShowSide ? '1px solid var(--color-gray-200)' : '0',
                } as any}
            >
                {/* 타이틀 좌측 영역 */}
                <div className={style['ta-left']}>
                    {/* 좌측 사이드 닫혔을 때 표기될 아이콘 */}
                    {mainSideState === 'close' && <span
                        className={style['side-area-btn']}
                        onClick={() => {
                            setMainSideState('open');
                        }}
                    >
                        <IconLayoutSidebarLeftExpandFilled size={18} />
                    </span>}
                    {/* 타이틀 */}
                    <Title order={5} className={style.title}>{titleLeft}</Title>
                </div>

                {/* 타이틀 우측 영역 */}
                <div className={style['ta-right']}>
                    {titleRight && titleRight}
                </div>
            </div>

            {/* 좌측 영역 */}
            {sideArea && sideArea}

            {/* 본문 영역 */}
            <div className={style['cont-area']}>{children}</div>
        </section>
    </>;
}
