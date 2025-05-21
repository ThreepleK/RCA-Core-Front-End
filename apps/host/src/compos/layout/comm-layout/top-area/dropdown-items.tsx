import { itemType, RouterState, useRouterStore } from "@repo/shared-state"
import { MenuItem } from './'
import { Menu } from "@mantine/core";

/**
 * 드랍다운 메뉴 아이템 표기
 */
export function DropdownItems({list} : {
    list: MenuItem[]        // 메뉴 아이템 리스트
}) {
    const { pageMove } = useRouterStore(s => s);

    return <>{list.map((item) => {
        const props = item?.props ?? {};

        switch(item.type){
            // 라벨
            case 'label': {
                return <Menu.Label key={item.label} {...props}>{item.label}</Menu.Label>;
            };
            // 메뉴
            case 'menu': {
                return <Menu.Item
                    key={item.label}
                    leftSection={item.icon}
                    onClick={() => onMenuClick(pageMove, item?.key)}
                    {...props}
                >{item.label}</Menu.Item>;
            };
            // 분리 선
            case 'div': {
                return <Menu.Divider key={`div-${Date.now()}-${Math.random()}`} {...props}/>;
            };
        }
    })}</>;
}

//* 메뉴 클릭
const onMenuClick = (
    pageMove: RouterState['pageMove'],  // 메뉴 이동처리 함수
    type: string|undefined              // 메뉴 타입
) => {
    if( !type || !(type in _LINKS) ){ return; }

    // 메뉴 이동
    const linkData = _LINKS[type];
    pageMove(linkData);
}

//* 링크 데이터
const _LINKS: {[key: string]: LinkItem} = {
    // 로그아웃
    'user-p-logout':        { type: 'move', label: 'Sign out', path: '/sign-out' },

    // 로그아웃
    'label-userGroup':      { type: 'tab',  label: 'User Group', path: '/admin/user-group' },
    'label-permission':     { type: 'tab',  label: 'Permission', path: '/admin/permission' },
}

//* 링크 아이템
type LinkItem = {
    type: itemType;
    label: string;
    path: string;
}
