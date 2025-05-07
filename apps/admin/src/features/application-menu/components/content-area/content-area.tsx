import { Tabs } from '@mantine/core';
import { MenuInfo, Permission } from './';
import { IconInfoSquareRounded, IconLicense } from '@tabler/icons-react';

import style from './content-area.module.css'

export function ContentArea({ className }: {
    className: string
}){
    return <div className={className}>
        <Tabs variant="default" defaultValue={_TAB_CONTS[0].key}>
            <Tabs.List className={style['tab-list']}>
                {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                    return <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>{item.label}</Tabs.Tab>
                })}
            </Tabs.List>

            {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                return <Tabs.Panel className={style['tab-cont']} key={idx} value={item.key}>{item.comp}</Tabs.Panel>
            })}
        </Tabs>
    </div>;
}

const _TAB_CONTS = [
    {label: 'Menu info', key: 'menuInfo', comp: <MenuInfo />, icon: <IconInfoSquareRounded size={15} strokeWidth={1.25} /> },
    {label: 'Permission', key: 'permission', comp: <Permission />, icon: <IconLicense size={15} strokeWidth={1.25} /> },
];