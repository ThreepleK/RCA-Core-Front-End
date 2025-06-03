import { useEffect, useState } from 'react';
import style from './ui-loading-overlay.module.css'

/**
 * 로딩 컴포넌트
 */
export function UI_LoadingOverlay({isOpen=false, zIndex=9999}: {
    isOpen?: boolean    // 보임여부
    zIndex?: number     // z축 index
}){
    const [isShow, setIsShow] = useState(isOpen);
    const [effect, setEffect] = useState('');

    // 보임 여부 제어 (컨텐츠 클린을 위함)
    useEffect(() => {
        if( isOpen ){
            setIsShow(true);

            // 효과 처리
            setTimeout(() => {
                setEffect('active-fade-in');
            }, 10);
        } else {
            // 효과 처리
            setEffect('active-fade-out');

            // 애니메이션 종료 시점에 닫기 처리
            setTimeout(() => {
                setIsShow(false);
            }, 350);
        }

    }, [isOpen]);

    return <>
        {isShow && <div
            style={{
                '--lo-zIndex': zIndex   // 로딩 표기할 z축
            } as any}
            className={`${style['ui-loading-overlay']} ${effect}`}
        ></div>}
    </>;
}