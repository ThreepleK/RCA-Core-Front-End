import { useEffect, useState } from 'react';
import { useStore } from 'zustand';

import { ContentsLayout, useContsLayoutStore } from '@/compos/layout';
import { UI_Flex, UI_Button } from '@/compos/ui';

import ContentArea from './components/content-area/content-area';
import style from './language.module.css'
import { useLocalSendEvent } from './stores';
import { IconPlus } from '@tabler/icons-react';

export function Language(){
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
            <ContentArea isCancel={isCancel} onChangeCancel={setIsCancel}/>
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
        setTitleLeft('Language');
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

    //* 저장    
    const onSave = () => {
        // sendEvent('save');
        console.log('save');
    };

    return (
        <UI_Flex justify='flex-end' align='center' gap='small' className={style['top-right']}>
            <UI_Button
                // icon={<IconPlus size={14} />}
                iconPosition='end'
                onClick={onSave}
                type="primary"
            >Save</UI_Button>
        </UI_Flex>
    )
}