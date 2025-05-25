import { request } from '@/utils'
import { MRT_ColumnFilterFnsState, MRT_PaginationState, MRT_SortingState } from 'mantine-react-table';

export type ApiResult = {
    isErr: boolean;     // 에러 여부
    res: any;           // 결과 값
    msg: string;        // 에러 메시지
};

type GridListParams = {
    pagination: MRT_PaginationState;
    search: string;
    filter: MRT_ColumnFilterFnsState[];
    sort: MRT_SortingState[];
};

/**
 * 그리드에서 사용될 요청 주소 값 적용
 * @param baseURL 기본 주소
 * @param opts 그리드에서 넘겨 받은 옵션 값
 */
function gridUrl(baseURL: string, opts: GridListParams){    
    const encode = (key: string, data: any) => {
        const isObj = typeof data === 'object';
        const reData = encodeURIComponent(isObj ? JSON.stringify(data) : data);
        return `${key}=${reData}`;
    }

    const { pageIndex, pageSize } = opts.pagination;

    return ( baseURL
        + encode('?start', pageIndex + pageSize)
        + encode('&size', pageSize)
        + encode('&filters', opts.filter ?? [])
        + encode('&search', opts.search ?? '')
        + encode('&sort', opts.sort ?? [])
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
export function api_list(opts: {
   pagination: MRT_PaginationState,
   search: string,
   filter: MRT_ColumnFilterFnsState[],
   sort: MRT_SortingState[],
}): Promise<{
    data: Array<any>,
    meta: { total: number }
}>{
    const url = gridUrl('/admin/api/*', opts);
    console.log(url);

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
export function api_createItem(data: any){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: data
    // });

    // 임시 시연용 api
    return api_demo();
}

/**
 * 아이템 수정
 */
export function api_updateItems(datas: any[]){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: datas
    // });

    // 임시 시연용 api
    return api_demo();
}

/**
 * 아이템 삭제
 */
export function api_removeItems(datas: any[]){
    // return request({
    //     type: 'post',
    //     url: '/admin/api/*',
    //     datas: datas
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