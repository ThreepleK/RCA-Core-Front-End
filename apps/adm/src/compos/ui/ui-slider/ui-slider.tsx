import { Slider, type SliderSingleProps } from 'antd';
import type { SliderRangeProps } from 'antd/es/slider';

import style from './ui-slider.module.css'

/**
 * Slider 컴포넌트
 * https://ant.design/components/slider
 */
export function UI_Slider(props: (SliderSingleProps | SliderRangeProps)){
    
    // Antd Slider 기본 설정
    return <Slider {...props} rootClassName={style['ui-slider']} />
}