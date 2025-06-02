import type { CustomCellRendererProps, CustomFilterProps } from "ag-grid-react";
import { useMemo, type ReactNode } from "react";
import { UI_Button } from "../..";

import style from './action-buttons.module.css'

export interface ActionButtonsProps extends CustomCellRendererProps {
    buttons: {[key: string]: string|ReactNode};
    feedback: (btnKey: string, data: any) => void;
}

/**
 * 액션 버튼
 */
export function ActionButtons(props: ActionButtonsProps){

    // 설정 할 버튼 가져오기
    const buttons = useMemo(() => {
        const res = [];

        for( const key in props.buttons ){
            const btn = props.buttons[key];

            res.push(
                <UI_Button
                    key={key}
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        // 액션버튼 피드백
                        props.feedback(key, props.data);
                    }}
                >{btn}</UI_Button>
            );
        }

        return res;
    }, [props.buttons]);

    // 버튼 출력
    return <div className={style['action-buttons']}>{buttons}</div>;
}