import { Button, Flex, Tabs } from '@mantine/core';
import { MenuInfo, Permission } from './';
import { IconInfoSquareRounded, IconLicense, IconPlus } from '@tabler/icons-react';

import style from './content-area.module.css'
import { ReactNode, useEffect, useState } from 'react';
import { useContsLayoutStore } from '@/compos/layout';
import { useStore } from 'zustand';
import { createSendAction, useGlobalSendAction } from '../../stores';
import { DropdownMenu } from '@/compos/ui/dropdown-menu';

// 우측 상단 버튼 제어용
const _useBtnActions = createSendAction();

export function ContentArea(){
    const tabKey = _useBtnActions(s => s.evKey);

    return <>
        {/* 컨텐츠 초기 설정 */}
        <InitCont />

        {/* 선택 된 탭 표기 */}
        {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
            const active = item.key === tabKey ? 'on-active' : '';

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
    const sendEvent = _useBtnActions(s => s.sendEvent);

    useEffect(() => {
        sendEvent(tab);
    }, [tab]);

    return <>
        <div className={style['title-right']}>
            <div className={style['tr-left']}>
                <Tabs variant="default" inverted value={tab} onChange={setTab} className={style['tab-list']}>
                    {/* 탭 목록 */}
                    <Tabs.List>
                        {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                            return <Tabs.Tab key={idx} value={item.key} leftSection={item.icon}>{item.label}</Tabs.Tab>
                        })}
                    </Tabs.List>
                </Tabs>
            </div>
            <div className={style['tr-right']}>
                {_TAB_CONTS && _TAB_CONTS.map((item, idx) => {
                    const active = item.key === tab ? 'on-active' : '';
                    return <div className={`${active}`} key={idx}>{item.buttons}</div>;
                })}
            </div>
        </div>
    </>;
}

/**
 * 권한 버튼 이벤트
 */
function PermissionButtons(){
    const sendEvent = useGlobalSendAction(s => s.sendEvent);

    //* 추가
    const onCreate = () => {
        sendEvent('create');
    };

    //* 액션버튼
    const onActions = (key: string) => {
        sendEvent(`selected-${key}`);
    };

    return (
        <Flex justify='flex-end' gap='xs'>
            <DropdownMenu label='Actions' menuList={_PERMISSION_ACTION_MENUS} onActions={onActions} />
            <Button size="xs" radius="md"
                leftSection={<IconPlus size={14} />}
                onClick={onCreate}
            >Create user</Button>
        </Flex>
    );
}

type TabItem = {
    icon: any;              // 탭 라벨 좌측에 들어갈 아이콘
    label: string;          // 탭 라벨
    key: string;            // 탭 & 본문 연결 키 값
    comp: ReactNode;        // 탭 본문 컴포넌트
    buttons: ReactNode;     // 탭 관련 버튼
}

// 탭 
const _TAB_CONTS: TabItem[] = [
    {
        label: 'Menu info', key: 'menuInfo',
        comp: <MenuInfo />,
        buttons: <></>,
        icon: <IconInfoSquareRounded size={15} strokeWidth={1.25} />
    },
    {
        label: 'Permission', key: 'permission',
        comp: <Permission />,
        buttons: <PermissionButtons />,
        icon: <IconLicense size={15} strokeWidth={1.25} />
    },
];

//* Actions 드랍다운 메뉴
const _PERMISSION_ACTION_MENUS = [
    {key: 'delete', label: 'Delete member'},
];