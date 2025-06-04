import { request } from '@/utils'
import type { IFetchSidebarMenu, IFetchSidebarMenuItem } from './models';


/**
 * sidebar 메뉴 가져오기
 */
export function api_getSidebarMenuData(){
    return request({
        type: 'get',
        url: '/admin/api/menu/sidebar'
    });
}

/**
 * sidebar 메뉴 저장하기
 */
export function api_setSidebarMenuData(data: IFetchSidebarMenu[]){
    return request({
        type: 'post',
        url: '/admin/api/menu/sidebar',
        datas: data
    });
}