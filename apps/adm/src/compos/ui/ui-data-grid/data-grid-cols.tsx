import { type ReactNode } from 'react';
import { ActionButtons } from './custom-cols';
import type { ColDef } from './';

/**
 * [Cols] 액션 버튼
 * @param opts
 * @param opts.buttons 버튼 모음
 * @param opts.feedback 버튼 클릭 이벤트
 */
export function f_actionButtons(opts: {
    buttons: {[key: string]: string|ReactNode};
    feedback: (btnKey: string, data: any) => void;
}) {
    return {
        cellRenderer: ActionButtons,
        cellRendererParams: opts,
    } as ColDef;
}

//* 커스텀 컬럼 모음
export const columnCustom = {
    actionBtns: f_actionButtons,
}