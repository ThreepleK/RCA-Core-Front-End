import { request } from '@/utils'
import type { ApiResult } from '.';
import { it } from 'node:test';

/**
 * 리스트 가져오기
 */
export async function api_list(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/permission-sets/detail'
    });

    if( res.isErr ){
        return [];
    } else {
        return (res as any).res;
    }
}

/**
 * 아이템 추가
 */
export function api_createItem(datas: any[]){
    console.log('datas', datas)
    // return request({
    //     type: 'put',
    //     url: '/admin/api/users',
    //     datas: datas
    // });

    // 임시 시연용 api
    return api_demo();
}

/**
 * 아이템 수정
 */
export function api_updateItems(type: string, rows: any[]){

    // return request({
    //     type: 'put',
    //     url: '/admin/api/users',
    //     datas: reqDatas
    // });

    // 임시 시연용 api
    return api_demo();
}

/**
 * 아이템 삭제
 */
export function api_deleteItems(datas: any[]){
    // return request({
    //     type: 'delete',
    //     url: '/admin/api/users',
    //     datas: {id: datas},
    // });

    // 임시 시연용 api
    return api_demo();
}

/**
 * 대모 시연용 api
 */
export function api_demo(): Promise<ApiResult>{
    return new Promise((resolve) => {
        // 랜덤 에러 설정
        const isErr = Math.round(Math.random() * 1) === 0;

        const res = {
            isErr: isErr,
            msg: isErr ? 'Failed to process.' : '',
            res: null,
        };

        setTimeout(() => {
            resolve(res);
        }, 1000);
    });
}

/**
 * 앱 메뉴 가져오기
 */
export async function api_getMenuData(){
    const res = await request({
        type: 'get',
        url: '/admin/api/menu/application'
    });

    // 에러일 경우
    if( res.isErr ){
        return [];
    }

    // 원본 메뉴 리스트
    const srcList = res.res;

    // root 메뉴
    const rootMenus = srcList.filter(r => r.level === 1)

    // root 하위 메뉴
    const childMenus = srcList.reduce((acc, item) => {
        if( item.level !== 2 ){ return acc; }

        // 부모 메뉴 아이디를 기준으로 하위 메뉴 설정
        const key = item.parentMenuId;
        if( !(key in acc) ){ acc[key] = []; }
        acc[key].push(item);
        return acc;
    }, {});

    // 최종 메뉴 합치기
    const menuSets = rootMenus.map(r => ({
        ...r,
        children: r.id in childMenus ? childMenus[r.id] : []
    }));

    return menuSets;
}