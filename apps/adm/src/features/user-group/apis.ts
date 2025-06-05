import { request } from '@/utils'
import dayjs from '@/utils/dayjs';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};

/**
 * 리스트 가져오기
 */
export async function api_list(): Promise<any[]>{

    // const res = await request({
    //     type: 'get',
    //     url: '/admin/api/users'
    // });

    // console.log('res', res);

    // if( res.isErr ){
    //     return [];
    // } else {
    //     return (res as any).res.data;
    // }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(_TMP_DATA);
        }, 1000);
    });
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
 * User Group
 * 리스트
 */
export function api_getUserGroup(): Promise<ApiResult>{
    return new Promise((resolve) => {
        const res = {
            isErr: false,
            msg: '',
            res: _GROUP_LIST,
        };

        setTimeout(() => {
            resolve(res);
        }, 1000);
    });
}

/**
 * Permission set
 * 리스트
 */
export function api_getPermission(): Promise<ApiResult>{
    return new Promise((resolve) => {
        const res = {
            isErr: false,
            msg: '',
            res: _PERMISSION_LIST,
        };

        setTimeout(() => {
            resolve(res);
        }, 1000);
    });
}

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        groupName: "Group 01",
        description: "first groups",
        users: 1358,
        permission: 'bistelligence',
    },
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f2",
        groupName: "Group 02",
        description: "seconds groups",
        users: 382,
        permission: 'bistelligence2',
    },
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f3",
        groupName: "Group 03",
        description: "3 groups",
        users: 4782,
        permission: 'bistelligence1',
    },
];

const _GROUP_LIST = [
    { label: 'Group 01',  value: 'group 01' },
    { label: 'Group 02',  value: 'group 02' },
    { label: 'Group 03',  value: 'bistelligence' },
];

const _PERMISSION_LIST = [
    { label: 'Permission 01',  value: 'permission 01' },
    { label: 'Permission 02',  value: 'permission 02' },
];