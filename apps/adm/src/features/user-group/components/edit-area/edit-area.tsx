import { useEffect, useMemo, useState } from 'react';
import type { TabsProps } from 'antd';

import { UI_Button, UI_DropdownMenu, UI_Flex, UI_Tabs, UI_Title } from '@/compos/ui';
import { IconCopyPlus, IconLicense, IconPlus, IconSettings, IconUserOff, IconUsers, IconX } from '@tabler/icons-react';
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

    // 탭 사이트 버튼
    const extra = useMemo(() => ({
        right: _EXTRA_BTN[activeTab]
    }), [activeTab]);

    return <>
        <UI_Tabs
            items={_TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
            size='small'
            rootClassName={style['tabs']}
            tabBarExtraContent={extra}
        />
    </>;
}

/**
 * Members 버튼
 */
function BtnMember(){
    const onClick = (key: string) => editViewStore.trigger(`${key}-members`);

    return <UI_Flex gap='small'>
        <UI_DropdownMenu
            menu={{ items: [{
                type: 'group',
                label: 'Members',
                children: [
                    { key: 'add',    label: 'Add',    icon: <IconPlus size={14} strokeWidth={1.25} /> },
                    { key: 'remove', label: 'Remove', icon: <IconUserOff size={14} strokeWidth={1.25} />, danger: true },
                ]
            }] }}
            size='small'
            trigger={['click']}
            onClick={onClick}
        >Actions</UI_DropdownMenu>
        <UI_Button size='small' type='primary' onClick={()=>onClick('save')}>Save member</UI_Button>
    </UI_Flex>
}

/**
 * Perssion sets 버튼
 */
function BtnPermission(){
    const onClick = (key: string) => editViewStore.trigger(`${key}-permission`);

    return <UI_Flex>
        <UI_Button size='small' type='primary' onClick={()=>onClick('save')}>Save permission</UI_Button>
    </UI_Flex>
}

/**
 * Settings 버튼
 */
function BtnSettings(){
    const onClick = (key: string) => editViewStore.trigger(`${key}-settings`);

    return <UI_Flex>
        <UI_Button size='small' type='primary' onClick={()=>onClick('save')}>Save settings</UI_Button>
    </UI_Flex>
}

// 탭 메뉴
const _TABS: TabsProps['items'] = [
    { key: 'members',            label: 'Members',          icon: <IconUsers size={14} strokeWidth={1.75} />,    forceRender: true, children: <TabMembers /> },
    { key: 'permission',         label: 'Permission sets',  icon: <IconLicense size={14} strokeWidth={1.75} />,  forceRender: true, children: <TabPermissionSets /> },
    { key: 'settings',           label: 'Settings',         icon: <IconSettings size={14} strokeWidth={1.75} />, forceRender: true, children: <TabSettings /> },
]

// 탭 우측 버튼
const _EXTRA_BTN = {
    members:    <BtnMember />,
    permission: <BtnPermission />,
    settings:   <BtnSettings />,
}