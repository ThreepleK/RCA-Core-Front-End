import { request } from '@/utils'
import dayjs from '@/utils/dayjs';
import type { ApiResult } from '.';

/**
 * [Edit > Tabs > Permission Set]
 * 리스트 가져오기
 */
export async function api_tabsPermissionList(): Promise<any[]>{

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


// 그리드 임시 데이터
const _TMP_DATA = [
    {
        id: 'woenfoewin200-2342348234-34323311',
        type: 'Menu Permission',
        permissionSets: 'Permission_01',
        description: 'permission 01 description'
    },
    {
        id: 'woenfoewin200-2342348234-34323312',
        type: 'Data Permission',
        permissionSets: 'Permission_02',
        description: 'permission 02 description'
    },
    {
        id: 'woenfoewin200-2342348234-34323313',
        type: 'Menu Permission',
        permissionSets: 'Permission_03',
        description: 'permission 03 description'
    }
];