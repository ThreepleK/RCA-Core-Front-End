import { ComponentTokenMap } from "antd/es/theme/interface";

/**
 * Button 컴포넌트 설정
 * https://ant.design/components/button
 */
export const _BUTTON = {
    paddingInlineSM: 'calc(var(--spacing) * 2)',      // x축 양쪽 패딩 (small)
    paddingInline:   'calc(var(--spacing) * 3)',      // x축 양쪽 패딩 (default)
    paddingInlineLG: 'calc(var(--spacing) * 4)',      // x축 양쪽 패딩 (large)
} as ComponentTokenMap['Button'];