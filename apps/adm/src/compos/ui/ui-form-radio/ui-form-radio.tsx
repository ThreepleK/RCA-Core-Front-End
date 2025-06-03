import { useMemo } from 'react';
import type { CheckboxOptionType } from 'antd';
import { UI_Radio } from '../ui-radio';
import style from './ui-form-radio.module.css'

// 추가 기능 속성
export interface UiFormRadioProps<T> {
    error?: string;             // 에러 내용
    warning?: string;           // 주의 할 내용
    label?: string;             // label
    required?: boolean;         // 필수 여부
    disabled?: boolean;         // 비활성화 여부
    data?: (CheckboxOptionType<T> | string | number)[]; // 라디오 데이터
    value?: any;                // 라디오 선택 값
    onChange: (e: any)=>void;   // 변경 값
}

/**
 * FormRadio 컴포넌트
 */
export function UI_FormRadio({
    error, warning,
    label, required, disabled,
    value, data, onChange
}: UiFormRadioProps<any>){
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

    return <div className={style['ui-form-radio']}>
        {/* 라벨 */}
        {label && <div className={style['label']}>
            {label}
            {required && <span className={style['required']}>*</span>}
        </div>}

        {/* 라디오 */}
        <UI_Radio
            options={data}
            value={value}
            disabled={disabled}
            onChange={onChange}
        />

        {/* 관련 메시지 */}
        {msg && <div className={`${style['msg']} ${status}`}>{msg}</div>}
    </div>
}