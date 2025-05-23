import { request } from '@/utils'

/**
 * 리스트 가져오기
 */
export function api_list(){
    // return request({
    //     type: 'get',
    //     url: '/admin/api/*'
    // });

    // 임시 데이터
    return new Promise((res) => {
        setTimeout(() => {
            res(_TMP_DATA);
        }, 2000);
    });
}

/**
 * 아이템 추가
 */
export function api_createItem(data: any){
    return request({
        type: 'post',
        url: '/admin/api/*',
        datas: data
    });
}

/**
 * 아이템 수정
 */
export function api_updateItems(datas: any[]){
    return request({
        type: 'post',
        url: '/admin/api/*',
        datas: datas
    });
}

/**
 * 아이템 삭제
 */
export function api_removeItems(datas: any[]){
    return request({
        type: 'post',
        url: '/admin/api/*',
        datas: datas
    });
}


// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        name: "admin",
        email: 'admin@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'active',
        createTime: '2025-05-23 15:47:00',
    },
    {
        id: "1323addd-a4ac-4dd1-8de2-6f934969a0f2",
        name: "yunny",
        email: 'yunny@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'active',
        createTime: '2025-05-23 15:49:00',
    },
    {
        id: "2343addd-a4ac-4dd1-8de2-6f934969a0f2",
        name: "tk",
        email: 'tk@bistelligence.ai',
        team: 'bistelligence',
        org: '',
        userGroup: '',
        status: 'active',
        createTime: '2025-05-23 16:24:00',
    },
];