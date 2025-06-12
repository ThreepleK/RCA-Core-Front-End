import { request } from '@/utils'
import type { ApiResult } from '.';

/**
 * 리스트 가져오기
 */
export async function api_list(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/user-groups/detail'
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
    // 배열 -> 1개 row로 가져오기
    const dataRow = datas[0];

    return request({
        type: 'post',
        url: '/admin/api/user-groups',
        datas: dataRow
    });
}

/**
 * 아이템 수정
 */
export function api_updateItem(row: any){

    console.log('row', row);

    return request({
        type: 'put',
        url: '/admin/api/user-groups/detail',
        datas: row
    });
}

/**
 * 아이템 삭제
 */
export function api_deleteItems(datas: any[]){
    // 삭제에 필요한 ID 모음
    const ids = datas.map(r => r.id);

    return request({
        type: 'delete',
        url: '/admin/api/user-groups',
        datas: {id: ids},
    });
}

/**
 * 아이템 복제
 */
export function api_cloneItem(datas: any, editDatas: any){
    // 복제 대상 row
    const src = datas[0];
    // 편집 대상 row
    const edit = editDatas[0];

    // 서버에 전달 할 값
    const data = {
        id: src.id,
        description: src.description,
        name: edit.name,
    };

    return request({
        type: 'put',
        url: '/admin/api/user-groups',
        datas: data,
    });
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