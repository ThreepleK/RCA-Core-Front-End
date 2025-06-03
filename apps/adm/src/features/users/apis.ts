import { request } from '@/utils'
import dayjs from '@/utils/dayjs';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};

/**
 * 그리드에서 사용될 요청 주소 값 적용
 * @param baseURL 기본 주소
 * @param opts 그리드에서 넘겨 받은 옵션 값
 */
function gridUrl(baseURL: string, opts: any){

    // 서버에 보내줄 UTC 포맷 설정
    const changeUTC = (date: Date) => {
        const utc = date.toISOString();
        const [time] = utc.split('Z', 1);

        // 소수점 3자리 추가 -> 총 6자리
        return `${time}000Z`;
    }

    // 날짜 관련 인코딩 설정
    const dateEncode = ( data: any ) => {
        if( Array.isArray(data) ){
            return (data as any[]).map(item => {
                return item instanceof Date ? changeUTC(item) : item;
            });
        }
        else if( data instanceof Date ) {
            return changeUTC(data);
        }
        return data;
    }

    //* 데이터 인코딩 처리
    const encode = (key: string, data: any) => {
        const reData = encodeURIComponent(typeof data === 'object'
            ? JSON.stringify(data)
            : typeof data === 'string'
                ? (data as string).toLowerCase()
                : data
        );
        return `${key}=${reData}`;
    }

    //* 그리드에서 넘겨준 필터 배열 key-value 형태로 변환
    const filters2Obj = (arr: Array<{id: string, value: any}>) => {
        const res = {};
        arr.forEach(({id, value}) => {
            const reVal = dateEncode(value);
            res[id] = typeof value === 'object' ? reVal : [reVal];
        });
        return res;
    }

    //* 그리드에서 넘겨준 정렬 배열 ["name,asc","email,desc"] 형태로 변환
    const sort2Arr = (arr: Array<{id: string, desc: boolean}>) => {
        const res = [];
        arr.forEach(({id, desc}) => {
            res.push(`${id},${desc ? 'desc' : 'asc'}`);
        });
        return res;
    }

    const { pageIndex, pageSize } = opts.pagination;

    return ( baseURL
        + encode('?page', pageIndex)
        + encode('&size', pageSize)
        + encode('&filters', filters2Obj(opts.filter as any) ?? {})
        + encode('&search', opts.search ?? '')
        + encode('&sort', sort2Arr(opts.sort as any) ?? [])
    );
}

/**
 * 리스트 가져오기
 * @param opts
 * @param opts.pagination   페이지 처리 값
 * @param opts.search       검색 키워드
 * @param opts.filter       컬럼 별 필터
 * @param opts.sort         컬럼 별 정렬
 */
export async function api_list(opts?: {
   pagination: any,
   search: string,
   filter: any[],
   sort: any[],
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