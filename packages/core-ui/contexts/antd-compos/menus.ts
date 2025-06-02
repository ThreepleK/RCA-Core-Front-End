import type { ComponentTokenMap } from "antd/es/theme/interface";

/**
 * 메뉴 컴포넌트 설정
 * https://ant.design/components/menu
 */
export const _MENU = {
    itemHeight: 38,                 // 메뉴 아이템 높이
    itemMarginBlock: 0,             // 메뉴 블럭 마진
    itemMarginInline: 0,            // 메뉴 안쪽 블럭 마진
    itemBorderRadius: 5,            // 아이템 테두리 라운드
    itemPaddingInline: 10,          // 하위 메뉴 없는 아이템 우측 여백
    subMenuItemBorderRadius: 5,     // 부메뉴 아이템 테두리 라운드
    iconMarginInlineEnd: 7,         // 아이콘 라벨 사이 간격
} as ComponentTokenMap['Menu'];