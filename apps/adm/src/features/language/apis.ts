import { request } from "@/utils";
import type { IFetchLanguageMenu, IFetchLanguageMenuItem } from "./models";

/**
 * sidebar 메뉴 가져오기
 */
export function api_getLanguageMenuData() {
    return request({
        type: "get",
        url: "/admin/api/menu/language",
    });
}

/**
 * sidebar 메뉴 저장하기
 */
export function api_setLanguageMenuData(data: IFetchLanguageMenu[]) {
    return request({
        type: "post",
        url: "/admin/api/menu/language",
        datas: data,
    });
}
