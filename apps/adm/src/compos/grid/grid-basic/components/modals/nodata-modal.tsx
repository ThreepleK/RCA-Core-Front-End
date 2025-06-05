import type { ReactNode } from 'react';

import { useCommModalStore } from '@/compos/modal';
import { UI_Button } from '@/compos/ui';

import style from './modal.module.css'

/**
 * [모달] 처리 할 아이템이 없을 때
 */
export function noDataModal(
    title: string | ReactNode,
){
    const { setOpen, setContent } = useCommModalStore.getState();
   
    //* 모달 설정
    setContent({
        // 제목
        title: (
            <div className={style['warning-title']}>{title}</div>
        ),
        // 내용
        content: (
            <div className={style['modal-content']}>
                Please select one or more items.
            </div>
        ),
        // 버튼 표기
        buttons: {
            confirm: <UI_Button type='primary' className={style['warning-button']}>Confirm</UI_Button>,
        },
        // 피드백
        feedback: async (key: string) => {
            setOpen(false);
        },
        size: 'xs',
    });

    //* 모달 열기
    setOpen(true);
}