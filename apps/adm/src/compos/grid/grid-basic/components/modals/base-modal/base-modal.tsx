import { useEffect, useMemo, useState, type ReactNode } from "react";
import { UI_Alert, UI_Flex, UI_LoadingOverlay, UI_Modal } from "@/compos/ui";

import style from './base-modal.module.css'
import type { SectionStore } from "@/stores";
import type { GridConnMap } from "../../../";

// 보여줄 컨텐츠
export type ShowCont = string | ReactNode | null;
export type ButtonItem = {[key: string]: ShowCont};
export type FeedbackCB = (key: string) => void;

/**
 * 공용 모달
 */
export function BaseModal({ conn }: {
    conn: SectionStore<GridConnMap>
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(isOpen);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<ShowCont>(null);

    const [modalSize, setModalSize] = useState<string>('md');

    const [title, setTitle] = useState<ShowCont>('');
    const [content, setContent] = useState<ShowCont>('');
    const [buttons, setButtons] = useState<ButtonItem>({});
    const [bottomLeftSection, setBottomLeftSection] = useState<ShowCont>(null);
    
    const [feedback, setFeedback] = useState<FeedbackCB>(null);

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
        setIsOpen(false);
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

    useEffect(() => {
        // 모달 로딩
        conn.on('modal-loading', (is: boolean) => setIsLoading(is));
        // 모달 Open/Close
        conn.on('modal-open', (is: boolean) => setIsOpen(is));
        // 모달 타이틀
        conn.on('modal-title', (title: ShowCont) => setTitle(title));
        // 모달 본문
        conn.on('modal-content', (content: ShowCont) => setContent(content));
        // 모달 버튼
        conn.on('modal-btns', (buttons: ButtonItem) => setButtons(buttons));
        // 모달 하단 좌측 영역
        conn.on('modal-btmLeftSection', (leftSection: ShowCont) => setBottomLeftSection(leftSection));
        // 모달 크기
        conn.on('modal-size', (size: string) => setModalSize(size));
        // 모달 에러 메시지
        conn.on('modal-errMsg', (msg: ShowCont) => setErrMsg(msg));
        // 모달 버튼 피드백
        conn.on('modal-feedback', (cb: FeedbackCB) => setFeedback(prevCB => cb));

        // unMount시 관련 이벤트 제거
        return () => {
            conn.offs([
                'modal-loading',
                'modal-open',
                'modal-title',
                'modal-content',
                'modal-btns',
                'modal-btmLeftSection',
                'modal-size',
                'modal-errMsg',
                'modal-feedback',
            ]);
        };
    }, []);

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
