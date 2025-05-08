import { useEffect, useRef } from "react";
import { useCtxBoxStore } from './ctx-box-store'

import style from './ctx-box.module.css'

/**
 * [마우스 우클릭]
 * 현재 위치 컨텐츠 표기용 박스
 */
export function CtxBox(){
    const boxRef = useRef<HTMLDivElement>(null);
    const {clientX, clientY, isOpen, content} = useCtxBoxStore(s => s);
    const {setOpen} = useCtxBoxStore(s => s);

    //* 박스 바깥쪽 클릭 처리
    const menuOutsideClick = (e: MouseEvent) => {
        if( boxRef.current && !boxRef.current.contains(e.target as Node) ){
            setOpen(false);
        }
    }

    //* 초기 이벤트 등록
    useEffect(() => {
        setTimeout(() => {
            if( isOpen ){
                window.addEventListener('click', menuOutsideClick);
            } else {
                window.removeEventListener('click', menuOutsideClick);
            }
        }, 100);
      
        return () => window.removeEventListener('click', menuOutsideClick);
    }, [isOpen]);


    return <div ref={boxRef} style={{
        display: (isOpen ? 'block' : 'none'),
        position: 'fixed',
        zIndex: 99999,
        left: clientX,
        top: clientY
    }}>
        <div className={style['ctx-box']}>
            {content}
        </div>
    </div>;
}