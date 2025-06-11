import { Typography, type TypographyProps } from 'antd';

import style from './ui-typography.module.css'

/**
 * Text 컴포넌트
 * https://ant.design/components/typography 
 */
export function UI_Typography (props: any){
    const { Text, Title, Link, Paragraph  } = Typography;
    
    console.log('props.typoType', props.typoType)
    // Antd Typography  기본 설정      
    return props.typoType === 'Text' ? <Text {...props} rootClassName={style['ui-typography']}>{props.text}</Text> 
    : props.typoType === 'Title' ? <Title {...props} rootClassName={style['ui-typography']}>{props.text}</Title> 
    : props.typoType === 'Link' ? <Link {...props} rootClassName={style['ui-typography']}>{props.text}</Link> 
    : <Paragraph {...props} rootClassName={style['ui-typography']}>{props.text}</Paragraph> 
}