import { request } from '@/utils'

export type MENU_ITEM = {
    displayName: string;
    name: string;
    isActive: boolean;
    isVisible: boolean;
    openInNewTab: boolean;
    sortOrder: number;
    url: string;
    level: number;
};
export type MENU_DATAS = {
    app_hub: MENU_ITEM[];
    core_features: MENU_ITEM[];
    custom_links: MENU_ITEM[];
};

/**
 * 앱 메뉴 가져오기
 */
export function api_getMenuData(){
    return request({
        type: 'get',
        url: '/core/api/menu/sidebar'
    }).then(({isErr, msg, res}) => {
        const data: MENU_DATAS = {
            app_hub: [],
            core_features: [],
            custom_links: [],
        };

        if( !isErr ){
            // 데이터 재가공
            res.forEach(({name, menus}: {
                name: keyof MENU_DATAS,
                menus: MENU_ITEM[],
            }) => {
                data[name] = menus;
            });
        }

        return {isErr, msg, res: data};
    });
}