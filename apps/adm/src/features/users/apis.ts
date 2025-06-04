import { request } from '@/utils'
import dayjs from '@/utils/dayjs';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};

/**
 * 리스트 가져오기
 * @param opts
 * @param opts.pagination   페이지 처리 값
 * @param opts.search       검색 키워드
 * @param opts.filter       컬럼 별 필터
 * @param opts.sort         컬럼 별 정렬
 */
export async function api_list(opts?: {
    pageIdx: number,
    pageSize: number,
    search: string,
    filter: any,
    sort: any,
}): Promise<{
    data: Array<any>,
    meta: { total: number }
}>{
    // const url = gridUrl('/admin/api/users', opts);
    // console.log(url);

    // const res = await request({
    //     type: 'get',
    //     url: url
    // });

    // if( res.isErr ){
    //     return {
    //         data: [],
    //         meta: { total: 0 },
    //     };
    // } else {
    //     return res.res;
    // }

    // return request({
    //     type: 'get',
    //     url: '/admin/api/*'
    // });

    // 임시 데이터
    return new Promise((res) => {
        setTimeout(() => {
            res({
                data: JSON.parse(JSON.stringify(_TMP_DATA)),
                meta: { total: 200 },
            });
        }, 1000);
    });
}

/**
 * 아이템 추가
 */
export function api_createItem(datas: any[]){
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
export function api_updateItems(datas: any[]){
    // return request({
    //     type: 'put',
    //     url: '/admin/api/users',
    //     datas: datas
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
 * 이메일 중복 확인
 * @param email 이메일 주소
 * @param id 사용자 고유 아이디
 */
export function api_chkDupleEmail(email: string, id?: string){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: {email}
    // });

    // (임시 로컬 개발 테스트 용) 
    return new Promise((resolve) => {

        // 중복 이메일 체크
        const isDuple = ((chkEmail: string) => {
            for( const item of _TMP_DATA ){
                // 다른 사용자의 이메일 주소와 같은지 확인
                if( item.email === chkEmail && (item?.id && item.id !== id) ){
                    return true;
                }
            }
            return false;
        })(email);

        // 딜레이 이후 결과 값 전달
        setTimeout(() => {
            resolve({
                isErr: isDuple,
                msg: isDuple ? '중복된 이메일주소 입니다.' : '',
                res: null,
            });
        }, 1000);
    
    });
}

/**
 * id 중복 확인
 * @param userid 사용자 id
 * @param id 사용자 고유 아이디
 */
export function api_chkDupleID(userid: string, id?: string){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: {email}
    // });

    // (임시 로컬 개발 테스트 용) 
    return new Promise((resolve) => {

        // 중복 아이디 체크
        const isDuple = ((chkId: string) => {
            for( const item of _TMP_DATA ){
                // 다른 사용자의 id와 같은지 확인
                if( item.username === chkId && (item?.id && item.id !== id) ){
                    return true;
                }
            }
            return false;
        })(userid);

        // 딜레이 이후 결과 값 전달
        setTimeout(() => {
            resolve({
                isErr: isDuple,
                msg: isDuple ? '중복된 사용자 ID 입니다.' : '',
                res: null,
            });
        }, 1000);
    
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

// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: "1323addd-a4ac-4dd2-8de2-6f934969a0f1",
        fullName: "admin",
        username: "admin",
        email: 'admin@bistelligence.ai',
        team: 'bistelligence',
        org: 100,
        userGroup: '',
        status: 'active',
        createdTime: '2025-05-23 15:47:00',
    },
    {
        id: "1323addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "yunny",
        username: "yunny",
        email: 'yunny@bistelligence.ai',
        team: 'bistelligence',
        org: 200,
        userGroup: '',
        status: 'inactive',
        createdTime: '2025-06-10 15:49:00',
    },
    {
        id: "2343addd-a4ac-4dd1-8de2-6f934969a0f2",
        fullName: "tk",
        username: "tk",
        email: 'tk@bistelligence.ai',
        team: 'bistelligence',
        org: 300,
        userGroup: '',
        status: 'active',
        createdTime: '2025-06-23 16:24:00',
    },
];