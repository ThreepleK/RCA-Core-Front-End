import { Tabs } from '@mantine/core';
import { MenuInfo, Permission } from './';
import { IconInfoSquareRounded, IconLicense } from '@tabler/icons-react';

import style from './content-area.module.css'

export function ContentArea({ className }: {
    className: string
}){
    return <div className={className}>
        <Tabs variant="default" defaultValue={_TAB_CONTS[1].key}>
            {/* 탭 목록 */}
            <Tabs.List className={style['tab-list']}>
                {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                    return <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>{item.label}</Tabs.Tab>
                })}
            </Tabs.List>

            {/* 탭 본문 */}
            {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                return <Tabs.Panel className={style['tab-cont']} key={idx} value={item.key}>{item.comp}</Tabs.Panel>
            })}
        </Tabs>
    </div>;
}

type TabItem = {
    label: string;  // 탭 라벨
    key: string;    // 탭 & 본문 연결 키 값
    comp: any;      // 탭 본문 컴포넌트
    icon: any;      // 탭 라벨 좌측에 들어갈 아이콘
}

// 탭 
const _TAB_CONTS: TabItem[] = [
    {label: 'Menu info', key: 'menuInfo', comp: <MenuInfo />, icon: <IconInfoSquareRounded size={15} strokeWidth={1.25} /> },
    {label: 'Permission', key: 'permission', comp: <Permission />, icon: <IconLicense size={15} strokeWidth={1.25} /> },
];