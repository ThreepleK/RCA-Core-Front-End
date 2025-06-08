import type { ReactNode } from 'react';
import { UI_Button } from '@/compos/ui';

import style from './modal.module.css'
import type { SectionStore } from '@/stores';

/**
 * [모달] 처리 할 아이템이 없을 때
 */
export function girdNodata(
    conn: SectionStore,
    title: string | ReactNode,
){
    //* 모달 설정
    conn.triggers({
        // 제목
        'modal-title': <div className={style['warning-title']}>{title}</div>,
        // 내용
        'modal-content': (
            <div className={style['modal-content']}>
                Please select one or more items.
            </div>
        ),
        // 모달 크기
        'modal-size': 'xs',
        // 모달 버튼 피드백
        'modal-feedback': (key: string) => {
            conn.trigger('modal-open', false);
        },
        // 모달 하단 좌측 영역
        'modal-btmLeftSection': null,
        // 모달 버튼
        'modal-btns': {
            confirm: <UI_Button type='primary' className={style['warning-button']}>Confirm</UI_Button>,
        },
        // 모달 열기
        'modal-open': true
    });
}
