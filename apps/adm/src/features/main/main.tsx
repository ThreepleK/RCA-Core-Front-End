import { ContentsLayout, useContsLayoutStore } from '@/compos/layout';
import { useEffect } from 'react';
import { useStore } from 'zustand';
import { ContentArea } from './components';

import style from './main.module.css'

export function Main(){
    return <>
        <ContentsLayout>
            {/* 초기 레이아웃 설정 */}
            <InitLayout />
            {/* 컨텐츠 */}
            <ContentArea />
        </ContentsLayout>
    </>;
}

/**
 * 초기 레이아웃 설정
 */
function InitLayout(){
    const contLayout = useContsLayoutStore();
    
    //-- 컨텐츠 설정
    const setTitleLeft = useStore(contLayout, s => s.setTitleLeft);
    const setContClass = useStore(contLayout, s => s.setContClass);

    //* 초기 설정
    useEffect(() => {
        // 타이틀 설정
        setTitleLeft('Main');

        // 본문 클래스 설정
        setContClass(style.content);
    }, []);

    return <></>;
}