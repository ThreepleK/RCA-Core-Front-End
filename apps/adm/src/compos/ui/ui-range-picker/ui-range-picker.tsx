import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
const { RangePicker } = DatePicker;

import style from './ui-range-picker.module.css'

/**
 * RangePicker 컴포넌트
 * https://ant.design/components/date-picker
 */
export function UI_RangePicker(props: RangePickerProps){
    
    // Antd DatePicker 기본 설정
    return <RangePicker {...props} rootClassName={style['ui-range-picker']} />
}