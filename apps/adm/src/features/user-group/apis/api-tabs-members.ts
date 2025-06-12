import { request } from '@/utils'
import dayjs from '@/utils/dayjs';
import type { ApiResult } from '.';

/**
 * [Edit > Tabs > Members]
 * 리스트 가져오기
 */
export async function api_tabsMemberList(): Promise<any[]>{

    const res = await request({
        type: 'get',
        url: '/admin/api/users'
    });

    console.log('res', res);

    if( res.isErr ){
        return [];
    } else {
        return (res as any).res;
    }
}


// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: 'woenfoewin200-2342348234-34323311',
        fullName: 'Portal Admin',
        userName: 'admin',
        email: 'admin@admin.com',
        status: 'active'
    }
];