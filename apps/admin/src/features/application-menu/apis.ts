import { request } from '@/utils'
import { DB_MENU_ITEM } from "./components";

/**
 * 앱 메뉴 가져오기
 */
export function api_getMenuData(){
    return request({
        type: 'get',
        url: '/admin/api/menu/application'
    });
}

/**
 * 앱 메뉴 저장하기
 */
export function api_setMenuData(data: DB_MENU_ITEM[]){
    return request({
        type: 'post',
        url: '/admin/api/menu/application',
        datas: data
    });
}