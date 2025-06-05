import { useMemo } from 'react';
import { UI_Select } from '../ui-select';

import style from './ui-form-select.module.css'

// 추가 기능 속성
export interface UiFormSelectProps {
    error?: string;             // 에러 내용
    warning?: string;           // 주의 할 내용
    label?: string;             // label
    required?: boolean;         // 필수 여부
    disabled?: boolean;         // 비활성화 여부
    data?: { label, value }[];  // select 데이터
    value?: any;                // select 선택 값
    onChange?: (e: any)=>void;  // 변경 값
    mode?: 'multiple' | 'tags'; // 모드
}

/**
 * FormSelect 컴포넌트
 */
export function UI_FormSelect({
    error, warning,
    label, required, disabled,
    value, data, onChange,
    mode,
}: UiFormSelectProps){

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
    
    // Antd Select 기본 설정
    return <div className={style['ui-form-select']}>
        {/* 라벨 */}
        {label && <div className={style['label']}>
            {label}
            {required && <span className={style['required']}>*</span>}
        </div>}

        <UI_Select
            className={style['ui-select']}
            options={data}
            value={value}
            onChange={onChange}
            disabled={disabled}
            mode={mode}
        />

        {/* 관련 메시지 */}
        {msg && <div className={`${style['msg']} ${status}`}>{msg}</div>}
    </div>;
}