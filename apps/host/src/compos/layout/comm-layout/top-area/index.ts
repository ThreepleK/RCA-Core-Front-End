export * from './top-area'
export * from './dropdown-items'
export * from './dropdown-user'
export * from './dropdown-admin'

//* 메뉴 설정에 필요한 타입
export interface MenuItem {
    type: string,       // 메뉴 타입, label: 메뉴 라벨, menu: 메뉴 명, div: 구분 선
    label?: string,     // 라벨
    icon?: any,         // 아이콘
    key?: string,       // 메뉴 클릭 키 갑
    props?: any,        // 관련 컴포넌트 추가 속성
};