import { Tabs } from '@mantine/core';
import { MenuInfo, Permission } from './';
import { IconInfoSquareRounded, IconLicense } from '@tabler/icons-react';

import style from './content-area.module.css'
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useContsLayoutStore } from '@/compos/layout';
import { useStore } from 'zustand';
import { useSendAction } from '../../stores';

export function ContentArea(){
    const evKey = useSendAction(s => s.evKey);

    return <>
        {/* 컨텐츠 초기 설정 */}
        <InitCont />

        {/* 선택 된 탭 표기 */}
        {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
            const active = item.key === evKey ? 'on-active' : '';

            return (
                <div className={`${style['tab-cont']} ${active}`} key={idx}>
                    {item.comp}
                </div>
            );
        })}
    </>;
}

/**
 * 초기 설정
 */
function InitCont(){
    const contLayout = useContsLayoutStore();
        
    //-- 컨텐츠 설정
    const setTitleRight = useStore(contLayout, s => s.setTitleRight);

    useEffect(() => {
        setTitleRight(<TitleRight />);
    }, []);

    return <></>;
}

/**
 * 우측 타이틀 설정
 */
function TitleRight(){
    const [tab, setTab] = useState(_TAB_CONTS[0].key);
    const sendEvent = useSendAction(s => s.sendEvent);

    useEffect(() => {
        sendEvent(tab);
    }, [tab]);

    return <>
        <div className={style['title-right']}>
            <div>
                <Tabs variant="default" inverted value={tab} onChange={setTab} className={style['tab-list']}>
                    {/* 탭 목록 */}
                    <Tabs.List>
                        {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                            return <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>{item.label}</Tabs.Tab>
                        })}
                    </Tabs.List>
                </Tabs>
            </div>
            <div>
                &nbsp;
            </div>
        </div>
    </>;
}

type TabItem = {
    label: string;  // 탭 라벨
    key: string;    // 탭 & 본문 연결 키 값
    comp: ReactNode; // 탭 본문 컴포넌트
    icon: any;      // 탭 라벨 좌측에 들어갈 아이콘
}

// 탭 
const _TAB_CONTS: TabItem[] = [
    {label: 'Menu info', key: 'menuInfo', comp: <MenuInfo />, icon: <IconInfoSquareRounded size={15} strokeWidth={1.25} /> },
    {label: 'Permission', key: 'permission', comp: <Permission />, icon: <IconLicense size={15} strokeWidth={1.25} /> },
];