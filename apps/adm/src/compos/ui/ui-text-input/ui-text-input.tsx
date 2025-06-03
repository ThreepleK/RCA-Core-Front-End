import { useMemo } from 'react';
import { UI_Input } from '../ui-input';
import style from './ui-text-input.module.css'

// 추가 기능 속성
export interface UiTextInputProps {
    error?: string;             // 에러 내용
    warning?: string;           // 주의 할 내용
    label?: string;             // label
    required?: boolean;         // 필수 여부
    disabled?: boolean;         // 비활성화 여부
    value?: string;             // input 값
    onChange: (e: any)=>void;   // 변경 값
}


/**
 * TextInput 컴포넌트
 */
export function UI_TextInput({
    error, warning,
    label, required, disabled,
    value, onChange
}: UiTextInputProps){
    //* 메시지 상태
    const status = useMemo(() => {
        if( error ){ return 'error'; }
        if( warning ){ return 'warning'; }
        return '';
    }, [error, warning]);

    //* 메시지 내용 가져오기
    const msg = useMemo(() => {
        if( error ){ return error; }
        if( warning ){ return warning; }
        return null;
    }, [error, warning]);

    return <div className={style['ui-text-input']}>
        {/* 라벨 */}
        {label && <div className={style['label']}>
            {label}
            {required && <span className={style['required']}>*</span>}
        </div>}

        {/* 입력 값 */}
        <UI_Input
            status={status}
            value={value}
            disabled={disabled}
            onChange={onChange}
        />

        {/* 관련 메시지 */}
        {msg && <div className={`${style['msg']} ${status}`}>{msg}</div>}
    </div>
}