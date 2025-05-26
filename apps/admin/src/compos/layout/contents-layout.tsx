import { FC, ReactNode } from 'react';
import { Flex, Title } from "@mantine/core";
import { useSideMenuAreaStore } from '@/stores';
import { IconLayoutSidebarLeftExpandFilled } from '@tabler/icons-react';

import style from './contents-layout.module.css'

/**
 * 본문 레이아웃
 */
export function ContentsLayout(props: {
    title: string|ReactNode,                // 제목
    titleRightSide: string|ReactNode,       // 제목 우측에 들어갈 내용
    children: ReactNode,                    // 본문 컨텐츠
    sideArea?: ReactNode,                   // 좌측 사이드 컨텐츠
    sideAreaWidth?: string,                 // 좌측 사이드 넓이 (px)
    CtxProvider?: FC<{ children: ReactNode }> // Provider
}) {
    const { CtxProvider } = props;

    // 보여줄 화면
    return <>
        {CtxProvider
            ? <CtxProvider><Layout {...props} /></CtxProvider>
            : <Layout {...props} />
        }
    </>;
}

function Layout({title, titleRightSide, children, sideArea, sideAreaWidth='0px'}: {
    title: string|ReactNode,                // 제목
    titleRightSide: string|ReactNode,       // 제목 우측에 들어갈 내용
    children: ReactNode,                    // 본문 컨텐츠
    sideArea?: ReactNode,                   // 좌측 사이드 컨텐츠
    sideAreaWidth?: string,                 // 좌측 사이드 넓이 (px)
}){
    const {currState: sideAreaState, setState: setSideAreaState} = useSideMenuAreaStore(s => s);

    return <>
        {/* 컨텐츠 */}
        <section className={style.section} style={{'--cs-width': sideAreaWidth} as any}>
            {/* 상단 타이틀 */}
            <Flex justify='space-between' className={style['title-area']}>
                <Flex gap='xs'>
                    {/* 좌측 사이드 닫혔을 때 표기될 아이콘 */}
                    {sideAreaState === 'close' && <span
                        className={style['side-area-btn']}
                        onClick={() => {
                            setSideAreaState('open');
                        }}
                    >
                        <IconLayoutSidebarLeftExpandFilled size={18} />
                    </span>}
                    {/* 타이틀 */}
                    <Title order={5} className={style.title}>{title}</Title>
                </Flex>
                {/* 타이츨 우측 영역 */}
                {titleRightSide && titleRightSide}
            </Flex>

            {/* 좌측 영역 */}
            {sideArea && sideArea}

            {/* 본문 영역 */}
            <div className={style['cont-area']}>{children}</div>
        </section>
    </>;
}
