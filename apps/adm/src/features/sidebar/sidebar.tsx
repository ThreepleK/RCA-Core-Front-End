import { useEffect, useState } from 'react';
import { useStore } from 'zustand';

import { ContentsLayout, useContsLayoutStore } from '@/compos/layout';
import { UI_Flex, UI_Button } from '@/compos/ui';

import ContentArea from './components/content-area/content-area';
import style from './sidebar.module.css'
import { useLocalSendEvent } from './stores';
import { IconPlus } from '@tabler/icons-react';

export function Sidebar(){
    const [isCancel, setIsCancel] = useState(false);

    const handleApplyButton = () => {
      console.log('apply button clicked');
    };

    const handleCancelButton = () => {
      setIsCancel(true);
    };
    
    return <>
        {/* 페이지 내 Action을 주고 받기 위한 SendActionProvider 추가 */}
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
        setTitleLeft('Sidebar');
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
    // const sendEvent = useLocalSendEvent(s => s.sendEvent);
    const { sendEvent } = useLocalSendEvent.getState();

    //* 저장    
    const onCreate = () => {
        sendEvent('save');
    };

    //* 취소        
    const onCancel = () => {
        console.log('onCancel');
        sendEvent('cancel');
    };


    return (
        <UI_Flex justify='flex-end' align='center' gap='small' className={style['top-right']}>
            <UI_Button
                icon={<IconPlus size={14} />}
                iconPosition='start'
                onClick={onCreate}
                type="primary"
            >Add license</UI_Button>
            <UI_Button
                onClick={onCancel}
            >Cancel</UI_Button>
            <UI_Button
                onClick={onCreate}
                type="primary"
            >Save</UI_Button>
        </UI_Flex>
    )
}