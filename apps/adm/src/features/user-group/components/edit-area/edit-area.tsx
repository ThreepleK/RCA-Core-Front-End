import { useEffect, useState } from 'react';
import type { TabsProps } from 'antd';

import { UI_Button, UI_Tabs, UI_Title } from '@/compos/ui';
import { IconLicense, IconSettings, IconUsers, IconX } from '@tabler/icons-react';
import { TabMembers, TabPermissionSets, TabSettings } from './tabs';
import { editViewStore } from '../../stores';

import style from './edit-area.module.css'

export function EditArea(){
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // open/close 이벤트
        editViewStore.on('edit-open', () => setIsOpen(true));
        editViewStore.on('edit-close', () => setIsOpen(false));

        // unMount
        return () => {
            editViewStore.off('edit-open');
            editViewStore.off('edit-close');
        };
    }, []);

    return <>
        {/* Edit 페이지 */}
        <div className={`${style['edit-area']} ${isOpen ? 'area-open': 'area-close'}`}>
            <div className={style['edit-view']}>
                <TitleArea onClose={() => setIsOpen(false)} />
                <EditView />
            </div>
        </div>
    </>;
}

/**
 * 타이틀 영역
 */
function TitleArea({onClose}: {
    onClose: ()=>void;
}){
    const [title, setTitle] = useState('Edit');

    useEffect(() => {
        // 타이틀 설정 이벤트
        editViewStore.on('edit-title', (title: string) => setTitle(title));

        // unMount
        return () => {
            editViewStore.off('edit-title');
        };
    }, []);
    
    return <>
        <div className={style['title-area']}>
            <UI_Title>{title}</UI_Title>
            <UI_Button size='small' type="text" onClick={onClose}>
                <IconX size={16} strokeWidth={1.25} />
            </UI_Button>
        </div>
    </>;
}

/**
 * 본문 
 */
function EditView(){
    const [activeTab, setActiveTab] = useState('members');

    useEffect(() => {
        // 보일 탭 설정
        editViewStore.on('edit-showTab', (tab: string) => setActiveTab(tab));

        // unMount
        return () => editViewStore.off('edit-showTab');
    }, []);

    return <>
        <UI_Tabs
            items={_TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
            size='small'
            rootClassName={style['tabs']}
        />
    </>;
}

// 탭 메뉴
const _TABS: TabsProps['items'] = [
    { key: 'members',            label: 'Members',          icon: <IconUsers size={14} strokeWidth={1.75} />,    forceRender: true, children: <TabMembers /> },
    { key: 'permission_sets',    label: 'Permission sets',  icon: <IconLicense size={14} strokeWidth={1.75} />,  forceRender: true, children: <TabPermissionSets /> },
    { key: 'settings',           label: 'Settings',         icon: <IconSettings size={14} strokeWidth={1.75} />, forceRender: true, children: <TabSettings /> },
]