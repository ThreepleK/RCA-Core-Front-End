import type { CustomFilterProps } from "ag-grid-react";
import { useMemo, type ReactNode } from "react";
import { UI_Button } from "../..";

import style from './action-buttons.module.css'

export interface ActionButtonsProps extends CustomFilterProps {
    buttons: {[key: string]: string|ReactNode};
    feedback: (btnKey: string) => void;
}

/**
 * 액션 버튼
 */
export function ActionButtons(props: ActionButtonsProps){

    const buttons = useMemo(() => {
        const res = [];

        for( const key in props.buttons ){
            const btn = props.buttons[key];

            res.push(<>
                <UI_Button
                    key={key}
                    type='text'
                    size='small'
                    onClick={(e) => {
                        e.stopPropagation();
                        props.feedback(key);
                    }}
                >{btn}</UI_Button>
            </>);
        }

        return res;
    }, [props.buttons]);

    return <div className={style['action-buttons']}>{buttons}</div>;
}