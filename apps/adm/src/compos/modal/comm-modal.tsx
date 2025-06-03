import { useCommModalStore } from "./comm-modal-store";
import { useEffect, useMemo, useState } from "react";
import { UI_Alert, UI_Flex, UI_LoadingOverlay, UI_Modal } from "../ui";

import style from './comm-modal.module.css'

/**
 * 공용 모달
 */
export function CommModal() {
    const {
        isOpen, title, content, buttons, bottomLeftSection, modalSize,
        isLoading, errMsg,
        feedback, setOpen
    } = useCommModalStore((s) => s);

    const [isShow, setIsShow] = useState(isOpen);

    // 하단 영역
    const bottomArea = useMemo(() => {
        //* 좌/우측 영역
        const leftArea = bottomLeftSection ?? <>&nbsp;</>;
        const rightArea = [];

        //* 모달 버튼
        for( const key in buttons){
            const btn = buttons[key];
            rightArea.push(
                <div key={key} onClick={() => feedback(key)}>{btn}</div>
            );
        }

        return (
            <UI_Flex justify="space-between" align="center" className={style['bottom-area']}>
                <UI_Flex gap="small" justify="flex-start" align="center">{leftArea}</UI_Flex>
                <UI_Flex gap="small" justify="flex-end" align="center">{rightArea}</UI_Flex>
            </UI_Flex>
        );
    }, [buttons]);

    // 닫기 처리
    const onClose = () => {
        // 로딩 중일 때는 닫지 않음
        if( isLoading ){ return; }

        // 모달 닫기
        setOpen(false);
    }

    // 모달 크기 설정
    const size = useMemo(() => {
        if( typeof modalSize === 'string' ){
            switch(modalSize){
                case 'xs': return '320px';
                case 'sm': return '380px';
                case 'md': return '440px';
                case 'lg': return '620px';
                case 'xl': return '780px';
            }
        }

        return modalSize;
    }, [modalSize]);

    // 보임 여부 제어 (컨텐츠 클린을 위함)
    useEffect(() => {
        if( isOpen ){
            setIsShow(true);
            return;
        }

        // 애니메이션 종료 시점에 닫기 처리
        setTimeout(() => {
            setIsShow(false);
        }, 350);
    }, [isOpen]);

    return (isShow &&
        <UI_Modal open={isOpen} title={title} onCancel={onClose} footer={null} width={size}>
            {/* 모달 본문 */}
            {content && content}

            {/* 에러 메시지 */}
            {errMsg && (
                <UI_Alert
                    className={style['alert']}
                    message={errMsg}
                    type='error'
                    showIcon
                />
            )}

            {/* 모달 하단 영역 */}
            {bottomArea}

            <UI_LoadingOverlay
                zIndex={1000}
                isOpen={isLoading}
            />
        </UI_Modal>
    );
}
