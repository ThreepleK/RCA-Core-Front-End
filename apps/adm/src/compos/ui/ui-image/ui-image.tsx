import { Image, type ImageProps } from 'antd';

import style from './ui-image.module.css'

/**
 * Image 컴포넌트
 * https://ant.design/components/image
 */
export function UI_Image(props: ImageProps){
    
    // Antd Image 기본 설정
    return <Image {...props} rootClassName={style['ui-image']} />
}