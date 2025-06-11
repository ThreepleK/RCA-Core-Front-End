import { request } from '@/utils'
import dayjs from '@/utils/dayjs';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string|object; // 에러 메시지
};

/**
 * 리스트 가져오기
 */
export async function api_list(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/users'
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
export function api_createItem(rows: any[]){
    const r = rows[0];

    const datas = {
        username: r.username,
        status: r.status,
        fullName: r.fullName,
        email: r.email,
        permissionSetIds: r.permissionSets,
        userGroupIds: r.userGroups,
        position: 'General User',
        userPictureUrl: null,
    };

    return request({
        type: 'put',
        url: '/admin/api/users',
        datas: [datas]
    });
}

/**
 * 아이템 수정
 */
export function api_updateItems(type: string, rows: any[]){
    const reqDatas = (() => {
        switch( type ){
            // status 활성화
            case 'status-active': {
                return rows.map(r => ({
                    ...r,
                    status: 'active'
                }));
            };
            // status 비활성화
            case 'status-inactive': {
                return rows.map(r => ({
                    ...r,
                    status: 'inactive'
                }));
            };
        }

        return rows;
    })();

    // 서버에 필요한 형태로 데이터 가공
    const datas = reqDatas.map(r => ({
        id: r.id,
        username: r.username,
        status: r.status,
        fullName: r.fullName,
        email: r.email,
        permissionSetIds: r.permissionSets,
        userGroupIds: r.userGroups,
        position: r.position,
        userPictureUrl: r.userPictureUrl,
    }));

    // 업데이트
    return request({
        type: 'put',
        url: '/admin/api/users',
        datas: datas
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
        url: '/admin/api/users',
        datas: {id: ids},
    });
}

/**
 * User Group
 * 리스트
 */
export function api_getUserGroup(): Promise<ApiResult>{
    return request({
        type: 'get',
        url: '/admin/api/user-groups'
    });
}

/**
 * Permission set
 * 리스트
 */
export function api_getPermission(): Promise<ApiResult>{
    return request({
        type: 'get',
        url: '/admin/api/permission-sets'
    });
}