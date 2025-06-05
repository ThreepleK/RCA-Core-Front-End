import { useEffect } from 'react';
import { useStore } from 'zustand';
import type { MenuProps } from 'antd';
import { IconCopyPlus, IconHeart, IconHeartOff, IconPlus, IconTrash } from '@tabler/icons-react';

import { ContentsLayout, useContsLayoutStore } from '@/compos/layout';
import { UI_Flex, UI_Button, UI_DropdownMenu } from '@/compos/ui';
import { ContentArea } from './components';
import { useLocalSendEvent } from './stores';

import style from './user-group.module.css'

export function UserGroup(){
    return <>
        {/* 페이지 컨텐츠 레이아웃 */}
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
    const setTitleRight = useStore(contLayout, s => s.setTitleRight);
    const setContClass = useStore(contLayout, s => s.setContClass);

    //* 초기 설정
    useEffect(() => {
        // 타이틀 설정
        setTitleLeft('User Group');
        setTitleRight(<TitleRightSide />);

        // 본문 클래스 설정
        setContClass(style.content);
    }, []);

    return <></>;
}

/**
 * 타이틀 우측
 */
function TitleRightSide(){
    // 이벤트 가져오기
    const sendEvent = useLocalSendEvent(s => s.sendEvent);

    //* 추가
    const onCreate = () => {
        sendEvent('create');
    };

    //* 액션버튼
    const onActions = (key: string) => {
        sendEvent(`selected-${key}`);
    };

    return (
        <UI_Flex justify='flex-end' align='center' gap='small' className={style['top-right']}>
            <UI_DropdownMenu
                menu={{ items: _ACTION_MENUS }}
                trigger={['click']}
                onClick={onActions}
            >Actions</UI_DropdownMenu>

            <UI_Button
                icon={<IconPlus size={14} />}
                iconPosition='end'
                onClick={onCreate}
                type="primary"
            >Add user group</UI_Button>
        </UI_Flex>
    )
}

//* Actions 드랍다운 메뉴
const _ACTION_MENUS: MenuProps['items'] = [
    { type: 'group', label: 'Selected user group', children: [
        { key: 'clone',  label: 'Clone',  icon: <IconCopyPlus size={14} strokeWidth={1.25} /> },
        { key: 'delete', label: 'Delete', icon: <IconTrash size={14} strokeWidth={1.25} />, danger: true },
    ] }
];