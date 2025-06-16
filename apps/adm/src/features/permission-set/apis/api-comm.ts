import { request } from '@/utils'
import type { ApiResult } from '.';

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
    // 1개 밖에 없음
    const row = datas[0];

    // 서버에 전달 할 내용으로 가공
    const item = {
        name: row.name,
        description: row.description,
        permissions: row.permissionEditList.map(r => ({
            menuId: r.id,
            readable: r.readable,
            creatable: r.creatable,
            deletable: r.deletable,
            updatable: r.updatable,
        })),
    };

    console.log('item', item);

    // 전달
    return request({
        type: 'post',
        url: '/admin/api/permission-sets',
        datas: item
    });
}

/**
 * 아이템 수정
 */
export function api_updateItems(type: string, rows: any[]){
    const items = [];

    // 그리드 row 1줄
    if( type === 'single' ){
        const row = rows[0];
        const item = {
            id: row.id,
            name: row.name,
            description: row.description,
            permissions: row.permissionEditList.map(r => ({
                menuId: r.id,
                readable: r.readable,
                creatable: r.creatable,
                deletable: r.deletable,
                updatable: r.updatable,
            })),
        };
        items.push(item);
    }

    return request({
        type: 'post',
        url: '/admin/api/permission-sets',
        datas: items[0]
    });
}

/**
 * 아이템 삭제
 */
export function api_deleteItems(datas: any[]){
    // 1개만 가능하기에 첫번째 값만 추림
    const row = datas[0];

    // 삭제 처리
    return request({
        type: 'delete',
        url: '/admin/api/permission-sets',
        datas: {id: [row]},
    });
}

/**
 * 아이템 복제
 */
export function api_cloneItem(id: string, row: any){

    // 서버에 전달 할 내용으로 가공
    const item = {
        id: id,
        name: row.name,
        description: row.description,
    };

    // 전달
    return request({
        type: 'put',
        url: '/admin/api/permission-sets',
        datas: item
    });
}

/**
 * 데모 시연용 api
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